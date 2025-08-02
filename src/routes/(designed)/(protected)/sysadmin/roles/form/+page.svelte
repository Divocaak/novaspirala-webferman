<script>
	import AdminForm from '$lib/AdminForm.svelte';
	export let data = null;
</script>

<a href="/sysadmin/roles">Zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/role.json"
	endpoint="/api/roles/{data.role ? 'update' : 'add'}"
	initialData={data.role}
/>
