<script>
	// @ts-nocheck
	import AdminForm from '$lib/AdminForm.svelte';
	export let data = null;
</script>

<a href="/sysadmin/structures">zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/structure.json"
	endpoint="/api/structures/{data.structure ? 'update' : 'add'}"
	initialData={data.structure}
/>
