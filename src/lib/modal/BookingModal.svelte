<script>
	import { onMount } from 'svelte';
	import { User } from '$lib/classes/user';
	import Modal from '$lib/modal/Modal.svelte';
	import Pill from '$lib/Pill.svelte';

	export let selectedEvent;
	export let closeModalFunction;
	export let user;

	const userData = User.fromJSON(user);

	let eid = selectedEvent?.id ?? '';
	let uid = userData.id;

	let selectedRoles = {};
	onMount(async () => {
		const res = await fetch(`/api/userBooking/get?eid=${eid}&uid=${uid}`);
		let selectedRolesData = await res.json();
		const roleIds = selectedRolesData.map((r) => r.rid);
		selectedRoles = Object.fromEntries(roleIds.map((rid) => [rid, true]));
	});

	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();

		const response = await fetch('/api/userBooking/add', {
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
		<label for="eid">ID (readonly)</label>
		<input id="eid" type="number" bind:value={eid} readonly /><br />

		<label for="uid">UID (readonly)</label>
		<input id="uid" type="number" bind:value={uid} readonly /><br />

		{#each userData.roles as role}
			<label class="option" for={role.id}>
				<input
					type="checkbox"
					name={role.id}
					bind:checked={selectedRoles[role.id]}
					disabled={selectedRoles[role.id]}
				/>{role.label}
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
