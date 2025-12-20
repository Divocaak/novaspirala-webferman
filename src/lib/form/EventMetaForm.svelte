<script>
	import StyledSelect from '$lib/form/StyledSelect.svelte';

	export let form;
	export let readonlyFull = false;
	export let readonlyDescription = false;
	export let usersAllowedToWrite = [];
	export let venues = [];
	export let genres = [];
</script>

<StyledSelect
	label="Vytvořil (readonly)"
	bind:value={form.id_created_by}
	options={usersAllowedToWrite}
	readonly
/>

<StyledSelect label="Prostor" bind:value={form.id_venue} options={venues} readonly={readonlyFull} />

<StyledSelect
	label="Žánr/typ"
	bind:value={form.id_genre}
	options={genres}
	readonly={readonlyFull}
/>

<label>
	* Název
	<input type="text" bind:value={form.label} required maxlength="32" readonly={readonlyFull} />
</label><br />

<label>
	Popis
	<textarea
		rows="10"
		cols="50"
		bind:value={form.description}
		maxlength="256"
		readonly={readonlyDescription}
	>
	</textarea>
</label><br />
