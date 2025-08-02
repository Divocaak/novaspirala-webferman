<script>
	import AdminForm from '$lib/AdminForm.svelte';
	export let data = null;
</script>

<a href="/sysadmin/venues">Zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/venue.json"
	endpoint="/api/venues/{data.venue ? 'update' : 'add'}"
	initialData={data.venue}
/>
