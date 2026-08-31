<script>
	import { User } from '$lib/classes/user';
	import StyledSelect from '$lib/form/StyledSelect.svelte';

	export let user;
	const userData = User.fromJSON(user);

	export let form;
	export let readonlyHeadField = false;
	export let readonlyDescriptionField = false;
	export let usersAllowedToWrite = [];
	export let venues = [];
	export let genres = [];
</script>

<StyledSelect
	label="Vytvořil (readonly)"
	bind:value={form.id_created_by}
	options={usersAllowedToWrite}
	readonly={!userData.isSysAdmin()}
/>

<StyledSelect
	label="Prostor"
	bind:value={form.id_venue}
	options={venues}
	readonly={readonlyHeadField}
/>

<StyledSelect
	label="Žánr/typ"
	bind:value={form.id_genre}
	options={genres}
	readonly={readonlyHeadField}
/>

<label>
	* Název
	<input type="text" bind:value={form.label} required maxlength="32" readonly={readonlyHeadField} />
</label><br />

<label>
	Popis<br />
	<textarea rows="20" cols="70" bind:value={form.description} readonly={readonlyDescriptionField}>
	</textarea>
</label><br />
