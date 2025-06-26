<script>
	import CustomSelect from '$lib/StyledSelect.svelte';
	export let data = null;

	console.log(data);

	let id = '';
	/* URGENT default is me */
	let id_created_by = null;
	let id_venue = null;
	let id_genre = null;
	let id_order = '';
	let label = '';
	let date_from = '';
	let date_to = '';
	let description = '';
	let text_color = '#ffffff';
	let background_color = '#000000';

	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();
		/* BUG check dropdowns mandatory */
		/* TODO validate date_to >= date_from */

		/* const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password })
		});

		if (response.ok) {
			success = 'succ';
			login = password = passwordAgain = '';
			error = '';
		} else {
			const data = await response.json();
			error = data.message;
		} */
	}
</script>

<a href="/events">zpět</a><br />

<form on:submit={handleSubmit}>
	<label for="id">id</label>
	<input id="id" type="number" bind:value={id} readonly disabled /><br />

	<CustomSelect
		label="created by"
		id="id_created_by"
		bind:value={id_created_by}
		required={true}
		options={data.usersAllowedToWrite}
	/>

	<CustomSelect
		label="prostor"
		id="id_venue"
		bind:value={id_venue}
		required={true}
		options={data.venues}
	/>

	<CustomSelect
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

	<!-- TODO roles, dynamically by available roles -->

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
