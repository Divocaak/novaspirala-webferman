<script>
	import { User } from './classes/user';

	export let id;
	export let user;
	const userObject = User.fromJSON(user);

	const deleteEvent = async (eventId) => {
		if (!confirm('Opravdu?')) return;

		const deleteResult = await fetch(`/api/events/delete?id=${eventId}`);
		const response = await deleteResult.json();

		if (response.status == 200) {
			alert(response.message);
			location.reload();
		} else {
			console.log(response.message);
			alert('error');
		}
	};
</script>

{#if userObject.isAllowedToDelete(event.createdById)}
	<button class="delete-btn" on:click={() => deleteEvent(id)}>Smazat</button>
{/if}

<style>
	.delete-btn {
		all: unset;
		cursor: pointer;
		color: #5755d9;
	}
</style>
