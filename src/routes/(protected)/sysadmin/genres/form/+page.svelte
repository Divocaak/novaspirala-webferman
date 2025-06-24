<script>
	import AdminForm from '$lib/AdminForm.svelte';
	export let data = null;
</script>

<a href="/sysadmin/genres">zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/genre.json"
	endpoint="/api/genres/{data.genre ? 'update' : 'add'}"
	initialData={data.genre}
/>
