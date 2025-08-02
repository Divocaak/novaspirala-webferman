<script>
	export let id;

	const deleteEvent = async (eventId) => {
		if (!confirm('Opravdu?')) return;

		const deleteResult = await fetch(`/api/events/delete?id=${eventId}`);
		const response = await deleteResult.json();

		if (response.status == 200) {
			alert(response.message);
			/* TODO reload page */
		} else {
			console.log(response.message);
			alert('error');
		}
	};
</script>

<button class="delete-btn" on:click={() => deleteEvent(id)}>Smazat</button>

<style>
	.delete-btn {
		all: unset;
		cursor: pointer;
		color: #5755d9;
	}
</style>
