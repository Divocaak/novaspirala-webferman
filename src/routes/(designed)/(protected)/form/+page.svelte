<script>
	import { User } from '$lib/classes/user.js';
	import { findInSelect } from '$lib/form/findInSelect.js';
	import { createEmptyRange, formatForMySQL, toDateInputValue } from '$lib/form/dates.js';

	import DateRanges from '$lib/form/DateRanges.svelte';
	import EventMetaForm from '$lib/form/EventMetaForm.svelte';
	import RolesAssignment from '$lib/form/RolesAssignment.svelte';

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
			background_color: event?.background_color ?? '#000000'
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
	// TODO
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
	let selectedUsersByRole = {};
	for (const role of data.roles) {
		if (!data.event) {
			selectedUsersByRole[role.role.id] = [];
			continue;
		}

		const assigned =
			data.event.assignedRoles
				?.filter((r) => r.rid === role.role.id)
				.map((r) => role.users.find((u) => u.id === r.uid))
				.filter(Boolean) ?? [];

		selectedUsersByRole[role.role.id] = assigned;
	}

	function buildRolesPayload(map) {
		return Object.entries(map).flatMap(
			([rid, users]) => users?.map((u) => ({ rid: Number(rid), uid: u.id })) ?? []
		);
	}

	/* ---------- payload ---------- */
	function buildPayload(form, dateRanges, roles) {
		return {
			...form,
			id_created_by: form.id_created_by.id,
			id_venue: form.id_venue.id,
			id_genre: form.id_genre.id,
			id_order: form.id_order,
			date_ranges: dateRanges.map((r) => ({
				date_from: formatForMySQL(r.from),
				date_to: formatForMySQL(r.to)
			})),
			roles: buildRolesPayload(roles)
		};
	}

	/* ---------- submit ---------- */
	let apiPath = data.event ? '/api/events/update' : '/api/events/add';
	let error = '';
	let success = '';
	async function submit(payload) {
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
		} catch (err) {
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

	<DateRanges
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
	<RolesAssignment roles={data.roles} bind:value={selectedUsersByRole} {user} eid={data.event?.id}/>
	<!-- END FORM ROLES -->

	{#if error}
		<p style="color:red">{error}</p>
	{/if}

	{#if success}
		<p style="color:green">{success}</p>
	{/if}

	<button type="submit">Uložit</button>
</form>
{#if data.event}
	<button type="button" on:click={copyEvent}> Kopírovat událost </button>
{/if}
