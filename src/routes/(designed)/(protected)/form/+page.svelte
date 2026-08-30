<script>
	import { User } from '$lib/classes/user.js';
	import { findInSelect } from '$lib/form/findInSelect.js';
	import { createEmptyRange, formatForMySQL, toDateInputValue } from '$lib/form/dates.js';
	import { goto } from '$app/navigation';

	import EventMetaForm from '$lib/form/EventMetaForm.svelte';
	import RolesAssignment from '$lib/form/RolesAssignment.svelte';
	import StyledMultiSelect from '$lib/form/StyledMultiSelect.svelte';
	import EventDateRanges from '$lib/form/dateRanges/EventDateRanges.svelte';

	export let data = null;
	const user = User.fromJSON(data.user);

	/* ---------- init ---------- */
	function initForm(event, user) {
		return {
			id: event?.id ?? '',
			id_created_by: findInSelect(data.usersAllowedToWrite, event?.id_created_by ?? user.id),
			id_venue: findInSelect(data.venues, event?.id_venue ?? null),
			id_genre: findInSelect(data.genres, event?.id_genre ?? null),
			id_order: event?.id_order ?? '',
			label: event?.label ?? '',
			description: event?.description ?? '',
			text_color: event?.text_color ?? '#ffffff',
			background_color: event?.background_color ?? '#000000',
			notifyUsers: []
		};
	}

	function initDateRanges(event) {
		if (!event) return [createEmptyRange()];
		return [
			{
				uid: crypto.randomUUID(),
				from: toDateInputValue(event.date_from),
				to: toDateInputValue(event.date_to)
			}
		];
	}

	let form = initForm(data.event, user);
	let dateRanges = initDateRanges(data.event);

	/* ---------- permissions ---------- */
	// NOTE KNOWN ISSUE pastEditable
	const pastEditable = false; //form.id_created_by.id ? true : false;
	$: isAllowedToEditHeadField = !user.isAllowedToEditHeadField(
		data.event,
		pastEditable,
		form.id_created_by.id
	);
	$: isAllowedToEditDescriptionField = !user.isAllowedToEditDescriptionField(
		data.event,
		pastEditable,
		form.id_created_by.id
	);

	/* ---------- roles ---------- */
	function initSelectedUsersByRole(event, roles) {
		const result = {};

		for (const role of roles) {
			const users = {};

			for (const assignment of event?.assignedRoles ?? []) {
				if (Number(assignment.rid) !== Number(role.role.id)) continue;

				const user = role.users.find((u) => Number(u.id) === Number(assignment.uid));

				if (!user) continue;

				if (!users[assignment.uid]) {
					users[assignment.uid] = {
						...user,
						dates: {}
					};
				}

				const eventDate = normalizeDate(event.date_from);

				users[assignment.uid].dates[eventDate] = {
					selected: true,
					note: assignment.note ?? ''
				};
			}

			result[role.role.id] = Object.values(users);
		}

		return result;
	}
	let selectedUsersByRole = initSelectedUsersByRole(data.event, data.roles);

	function normalizeDate(date) {
		if (!date) return null;
		if (typeof date === 'string') return date.slice(0, 10);
		return [
			date.getFullYear(),
			String(date.getMonth() + 1).padStart(2, '0'),
			String(date.getDate()).padStart(2, '0')
		].join('-');
	}

	function buildRolesPayload(usersByRole) {
		return Object.entries(usersByRole).flatMap(([rid, users]) =>
			(users ?? []).flatMap((user) =>
				Object.entries(user.dates ?? {})
					.filter(([, dateData]) => dateData.selected)
					.map(([date, dateData]) => ({
						uid: user.id,
						rid: Number(rid),
						date,
						note: dateData.note ?? ''
					}))
			)
		);
	}

	/* ---------- payload ---------- */
	function buildPayload(form, dateRanges, roles) {
		return {
			...form,
			id_created_by: form.id_created_by.id,
			id_venue: form.id_venue.id,
			id_genre: form.id_genre.id,
			date_ranges: dateRanges.map((range) => ({
				date_from: formatForMySQL(range.from),
				date_to: formatForMySQL(range.to)
			})),
			roles: buildRolesPayload(roles)
		};
	}

	/* ---------- submit ---------- */
	let apiPath = data.event ? '/api/events/update' : '/api/events/add';
	let error = '';
	let success = '';
	async function submit(payload) {
		console.log(JSON.stringify(payload));
		const res = await fetch(apiPath, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const { message } = await res.json();
			throw new Error(message);
		}
	}

	async function handleSubmit(e, mode = 'save') {
		e.preventDefault();

		for (const r of dateRanges) {
			if (r.from && r.to && new Date(r.to) < new Date(r.from)) {
				alert('Od musí být dříve než Do');
				return;
			}
		}

		try {
			await submit(buildPayload(form, dateRanges, selectedUsersByRole));

			let message;
			if (mode === 'copy') message = 'kopírován';
			else if (data.event) message = 'upraven';
			else message = 'vytvořen';

			alert(`Event ${message}`);

			success = 'Uloženo';
			error = '';

			await goto('/home');
		} catch (err) {
			console.log(err);
			error = err.message;
			success = '';
		}
	}

	/* ---------- copy ---------- */
	async function copyEvent(e) {
		const oldApiPath = apiPath;
		apiPath = '/api/events/add';

		form = { ...form, id: '' };
		dateRanges = dateRanges.map((r) => ({
			...r,
			uid: crypto.randomUUID()
		}));

		try {
			await handleSubmit(e, 'copy');
		} finally {
			apiPath = oldApiPath;
		}
	}
</script>

<a href="/">zpět</a><br />

<form on:submit={handleSubmit}>
	<!-- FORM HEAD -->
	<label>
		ID (readonly)
		<input type="number" bind:value={form.id} readonly />
	</label><br />

	<label>
		ID Objednávky
		<input
			type="text"
			bind:value={form.id_order}
			readonly={isAllowedToEditHeadField}
			maxlength="16"
		/>
	</label><br />

	<EventMetaForm
		bind:form
		readonlyHeadField={isAllowedToEditHeadField}
		readonlyDescriptionField={isAllowedToEditDescriptionField}
		usersAllowedToWrite={data.usersAllowedToWrite}
		venues={data.venues}
		genres={data.genres}
	/>

	<EventDateRanges
		bind:ranges={dateRanges}
		readonly={isAllowedToEditHeadField}
		single={!!data.event}
	/><br />

	<label>
		* Barva textu
		<input type="color" bind:value={form.text_color} disabled={isAllowedToEditHeadField} />
	</label><br />

	<label>
		* Barva pozadí
		<input type="color" bind:value={form.background_color} disabled={isAllowedToEditHeadField} />
	</label><br />
	<!-- END FORM HEAD -->

	<!-- FORM ROLES -->
	<RolesAssignment
		roles={data.roles}
		bind:value={selectedUsersByRole}
		{user}
		eid={data.event?.id}
		vacations={data.vacations}
		{dateRanges}
	/>
	<!-- END FORM ROLES -->

	<button type="submit">Uložit</button><br />

	{#if error}
		<p style="color:red">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color:green">{success}</p>
		<br />
	{/if}

	<!-- NOTIFY USERS -->
	{#if data.usersAllowedToReceiveNotifications.length < 1}
		<p>Zatím nemůže nikdo přijímat notifikace</p>
	{:else}
		<StyledMultiSelect
			id="notifyUsersMultiSelect"
			label={'Rozeslat notifikace'}
			options={data.usersAllowedToReceiveNotifications}
			bind:value={form.notifyUsers}
			{dateRanges}
		/>
	{/if}
	<!-- NOTIFY USERS END -->
</form>
{#if data.event}
	<button type="button" on:click={copyEvent}> Kopírovat událost </button>
{/if}
