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
	/* TODO default values */
	let selectedRoles =
		/* data.event?.assignedRoles?.filter((r) => r.rid === role.role.id).map((r) => role.users.find((u) => u.id === r.uid)).filter(Boolean) ||  */ {};

	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();

		const response = await fetch('/api/users/book/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, uid, selectedRoles })
		});

		if (response.ok) {
			success = 'Uloženo';
			error = '';
			alert(`Úspěšně zabookováno`);
		} else {
			const data = await response.json();
			error = data.message;
			alert('error');
		}
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
			<!-- TODO if default valu true, disable -->
			<label class="option" for={id}>
				<input type="checkbox" name={role.id} bind:checked={selectedRoles[role.id]} />{role.label}
			</label><br />
		{/each}

		{#if error}
			<p style="color: red;">{error}</p>
			<br />
		{/if}

		{#if success}
			<p style="color: green;">{success}</p>
			<br />
		{/if}
		<p>Booking směny je <b>závazný</b> a <b>nedá se zrušit</b>!</p>
		<button type="submit">Uložit</button><br />
	</form>
</Modal>
