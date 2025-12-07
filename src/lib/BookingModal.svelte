<script>
	import { User } from './classes/user';
	import Modal from './Modal.svelte';
	import Pill from './Pill.svelte';

	export let selectedEvent;
	export let closeModalFunction;
	export let user;

	const userData = User.fromJSON(user);

	let id = selectedEvent?.id ?? '';
	let uid = userData.id;
	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();
	}
</script>

<Modal {closeModalFunction}>
	<h1>
		<Pill label={selectedEvent.label} txtClr={selectedEvent.txtClr} bgClr={selectedEvent.bgClr} />
	</h1>

	<form on:submit={handleSubmit}>
		<label for="id">ID (readonly)</label>
		<input id="id" type="number" bind:value={id} readonly /><br />

		<label for="id">UID (readonly)</label>
		<input id="id" type="number" bind:value={uid} readonly /><br />

		{#each userData.roles as role}
		 <!-- aria-selected={isSelected(option)} -->
			<label class="option" for={id}>
				<input
					type="checkbox"
					name={role.id}
					value={role.id}
					/>
					<!-- checked={isSelected(option)}
					on:change={() => toggleOption(option)}
					disabled={readonly} -->
				{role.label}</label
			>
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
</Modal>
