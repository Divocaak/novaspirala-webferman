<script>
	import { onMount } from 'svelte';
	import { User } from '$lib/classes/user';
	import Modal from '$lib/modal/Modal.svelte';
	import Pill from '$lib/Pill.svelte';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';

	export let closeModalFunction;
	export let notifications;

	export let user;
	const userData = User.fromJSON(user);

	let error = '';
	let success = '';

	let selectedNotifications = new Set();
	function toggleNotification(id) {
		const updated = new Set(selectedNotifications);
		if (updated.has(id)) updated.delete(id);
		else updated.add(id);
		selectedNotifications = updated;
	}
	function selectAll() {
		selectedNotifications = new Set(notifications.map((n) => n.id));
	}
	function resetAll() {
		selectedNotifications = new Set();
	}

	async function markAsRead(notifs) {
		const notificationsToRead = Array.isArray(notifs) ? notifs : [notifs];

		const response = await fetch('/api/eventNotifications/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				notifications: notificationsToRead.map((notif) => ({
					id: notif.id,
					id_event: notif.id_event,
					id_user_recipient: notif.id_user_recipient
				}))
			})
		});

		if (response.ok) {
			const ids = new Set(notificationsToRead.map((notif) => notif.id));
			notifications = notifications.filter((n) => !ids.has(n.id));
			for (const id of ids) selectedNotifications.delete(id);
			selectedNotifications = new Set(selectedNotifications);
		}
	}
</script>

<Modal {closeModalFunction}>
	<h1>Event notifikace</h1>
	<div class="actions">
		<button type="button" on:click={selectAll}>Vybrat vše</button>
		<button type="button" on:click={resetAll}>Zrušit výběr</button>
	</div>
	<table>
		<thead>
			<tr>
				<th></th>
				<th scope="col">Název eventu</th>
				<th scope="col">Od, do</th>
				<th scope="col">Typ notifikace</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each notifications as notif}
				<tr>
					<td>
						<input
							type="checkbox"
							checked={selectedNotifications.has(notif.id)}
							on:change={() => toggleNotification(notif.id)}
						/>
					</td>
					<td>
						<Pill label={notif.label} txtClr={notif.text_color} bgClr={notif.background_color} />
					</td>
					<td>
						<LocalisedDateRange from={notif.date_from} to={notif.date_to} wrap={true} />
					</td>
					<td>
						{#if notif.type == 'created'}
							<Pill label="Vytvořeno" txtClr="#1F2937" bgClr="#A8E6CF" />
						{:else}
							<Pill label="Aktualizováno" txtClr="#3A2E00" bgClr="#F7DC6F" />
						{/if}
					</td>
					<td>
						<button type="button" on:click={() => markAsRead(notif)}> Označit přečtené </button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if selectedNotifications.size > 0}
		<br />
		<button
			type="button"
			on:click={() => markAsRead(notifications.filter((n) => selectedNotifications.has(n.id)))}
		>
			Označit vybrané jako přečtené ({selectedNotifications.size})
		</button>
	{/if}
</Modal>

<style>
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
