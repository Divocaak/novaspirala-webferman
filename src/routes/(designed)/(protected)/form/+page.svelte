<script>
	import StyledMultiSelect from '$lib/StyledMultiSelect.svelte';
	import StyledSelect from '$lib/StyledSelect.svelte';
	import { findInSelect } from '$lib/findInSelect.js';

	export let data = null;

	const toDateInputValue = (dateStr) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		const timezoneOffset = date.getTimezoneOffset() * 60000;
		const localDate = new Date(date.getTime() - timezoneOffset);
		const iso = localDate.toISOString();
		return iso.slice(0, 16);
	};

	const formatForMySQL = (dateStr) => {
		if (!dateStr) return null;
		return dateStr.replace('T', ' ') + ':00';  // "2025-08-18T14:30" → "2025-08-18 14:30:00"
	};

	let id = data.event?.id ?? '';
	let id_created_by = findInSelect(
		data.usersAllowedToWrite,
		data.event?.id_created_by ?? data.user.id
	);
	let id_venue = findInSelect(data.venues, data.event?.id_venue ?? null);
	let id_genre = findInSelect(data.genres, data.event?.id_genre ?? null);
	let id_order = data.event?.id_order ?? '';
	let label = data.event?.label ?? '';
	let date_from = toDateInputValue(data.event?.date_from);
	let date_to = toDateInputValue(data.event?.date_to);
	let description = data.event?.description ?? '';
	let text_color = data.event?.text_color ?? '#ffffff';
	let background_color = data.event?.background_color ?? '#000000';

	let selectedUsersByRole = {};
	for (const role of data.roles) {
		if (!data.event) break;

		const assigned =
			data.event?.assignedRoles
				?.filter((r) => r.rid === role.role.id)
				.map((r) => role.users.find((u) => u.id === r.uid))
				.filter(Boolean) || [];
		selectedUsersByRole[role.role.id] = assigned;
	}

	let error = '';
	let success = '';
	const apiPath = data.event ? '/api/events/update' : '/api/events/add';
	async function handleSubmit(event) {
		event.preventDefault();

		if (new Date(date_to) < new Date(date_from)) {
			alert('Hodnota Od musí být dřív než hodnota Do');
			return;
		}

		const rolesToRet = [];
		for (const [roleId, selectedUsers] of Object.entries(selectedUsersByRole))
			if (selectedUsers && selectedUsers.length)
				for (const user of selectedUsers) rolesToRet.push({ rid: Number(roleId), uid: user.id });

		const toSend = {
			id,
			id_created_by: id_created_by.id,
			id_venue: id_venue.id,
			id_genre: id_genre.id,
			id_order,
			label,
			date_from: formatForMySQL(date_from),
			date_to: formatForMySQL(date_to),
			description,
			text_color,
			background_color,
			roles: rolesToRet
		};

		const response = await fetch(apiPath, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(toSend)
		});

		if (response.ok) {
			success = 'Uloženo';

			if (!data.event) {
				id_venue = null;
				id_genre = null;
				id_order = '';
				label = '';
				date_from = '';
				date_to = '';
				description = '';
				text_color = '#ffffff';
				background_color = '#000000';
			}

			error = '';
			alert(`Event úspěšně ${data.event ? 'upraven' : 'vytvořen'}`);
		} else {
			const data = await response.json();
			error = data.message;
			alert('error');
		}
	}
</script>

<a href="/">zpět</a><br />

<form on:submit={handleSubmit}>
	<label for="id">ID (readonly)</label>
	<input id="id" type="number" bind:value={id} readonly disabled /><br />

	<StyledSelect
		label="Vytvořil (readonly)"
		id="id_created_by"
		bind:value={id_created_by}
		required={true}
		options={data.usersAllowedToWrite}
		readonly={true}
	/>

	<StyledSelect
		label="Prostor"
		id="id_venue"
		bind:value={id_venue}
		required={true}
		options={data.venues}
	/>

	<StyledSelect
		label="Žánr/typ"
		id="id_genre"
		bind:value={id_genre}
		required={true}
		options={data.genres}
	/>

	<label for="id_order">ID Objednávky</label>
	<input id="id_order" type="text" bind:value={id_order} maxlength="16" /><br />

	<label for="label">* Název</label>
	<input id="label" type="text" bind:value={label} required maxlength="32" /><br />

	<label for="date_from">* Od</label>
	<input id="date_from" type="datetime-local" bind:value={date_from} required /><br />

	<label for="date_to">* Do</label>
	<input id="date_to" type="datetime-local" bind:value={date_to} required /><br />

	<label for="description">Popis</label><br />
	<textarea id="description" rows="10" cols="50" bind:value={description} maxlength="256"
	></textarea>
	<br />

	<label for="text_color">* Barva textu</label>
	<input id="text_color" type="color" bind:value={text_color} required /><br />

	<label for="background_color">* Barva pozadí</label>
	<input id="background_color" type="color" bind:value={background_color} required /><br />

	{#each data.roles as role, i}
		<div style="background-color: {role.role.bgClr}; color: {role.role.txtClr}">
			{#if role.users.length < 1}
				<p>Počet uživatelů s rolí "<b>{role.role.label}</b>" je 0</p>
			{:else}
				<StyledMultiSelect
					label={role.role.label}
					id="id_role_{role.role.id}"
					bind:value={selectedUsersByRole[role.role.id]}
					options={role.users}
				/>
			{/if}
			<p>{role.role.note}</p>
		</div>
	{/each}

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
		<br />
	{/if}

	<button type="submit">Uložit</button><br />
</form>

<style>
	input {
		margin: 10px 0;
	}

	input:last-of-type {
		margin-bottom: 20px;
	}
</style>
