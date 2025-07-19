<script>
	import StyledSelect from '$lib/StyledSelect.svelte';
	export let data = null;

	const myIndex = data.usersAllowedToWrite.findIndex((user) => user.id === data.user.id);

	event;

	let id = data.event?.id ?? '';
	let id_created_by = data.event?.id_created_by ?? data.usersAllowedToWrite[myIndex];
	let id_venue = data.event?.id_venue ?? null;
	let id_genre = data.event?.id_genre ?? null;
	let id_order = data.event?.id_order ?? '';
	let label = data.event?.label ?? '';
	let date_from = data.event?.date_from ?? '';
	let date_to = data.event?.date_to ?? '';
	let description = data.event?.description ?? '';
	let text_color = data.event?.text_color ?? '#ffffff';
	let background_color = data.event?.background_color ?? '#000000';

	let selectedUsersByRole = {};

	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();

		if (new Date(date_to) < new Date(date_from)) {
			alert('date_to < date_from');
			return;
		}

		const rolesToRet = [];
		for (const [roleId, selectedUser] of Object.entries(selectedUsersByRole)) {
			if (selectedUser) rolesToRet.push({ rid: Number(roleId), uid: selectedUser.id });
		}

		const toSend = {
			id,
			id_created_by: id_created_by.id,
			id_venue: id_venue.id,
			id_genre: id_genre.id,
			id_order,
			label,
			date_from,
			date_to,
			description,
			text_color,
			background_color,
			roles: rolesToRet
		};

		const response = await fetch('/api/events/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(toSend)
		});

		if (response.ok) {
			success = 'succ';
			/* TODO clear form */
			//login = password = passwordAgain = '';
			error = '';
			alert("event added succesfully")
		} else {
			const data = await response.json();
			error = data.message;
			alert("error")
		}
	}
</script>

<a href="/events">zpět</a><br />

<form on:submit={handleSubmit}>
	<label for="id">id</label>
	<input id="id" type="number" bind:value={id} readonly disabled /><br />

	<StyledSelect
		label="created by"
		id="id_created_by"
		bind:value={id_created_by}
		required={true}
		options={data.usersAllowedToWrite}
	/>

	<StyledSelect
		label="prostor"
		id="id_venue"
		bind:value={id_venue}
		required={true}
		options={data.venues}
	/>

	<StyledSelect
		label="žánr/typ"
		id="id_genre"
		bind:value={id_genre}
		required={true}
		options={data.genres}
	/>

	<label for="id_order">objednávka</label>
	<input id="id_order" type="text" bind:value={id_order} maxlength="16" /><br />

	<label for="label">* název</label>
	<input id="label" type="text" bind:value={label} required maxlength="32" /><br />

	<label for="date_from">* od</label>
	<input id="date_from" type="date" bind:value={date_from} required /><br />

	<label for="date_to">* do</label>
	<input id="date_to" type="date" bind:value={date_to} required /><br />

	<label for="description">popis</label>
	<textarea id="description" rows="4" cols="50" bind:value={description} maxlength="256"></textarea>
	<br />

	<label for="text_color">* barva textu</label>
	<input id="text_color" type="color" bind:value={text_color} required /><br />

	<label for="background_color">* barva pozadí</label>
	<input id="background_color" type="color" bind:value={background_color} required /><br />

	{#each data.roles as role, i}
		<div style="background-color: {role.role.bgClr}; color: {role.role.txtClr}">
			{#if role.users.length < 1}
				<p>počet uživatelů s rolí <b>{role.role.label}</b> je 0</p>
			{:else}
				<StyledSelect
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

	<button type="submit">odeslat</button><br />
</form>
