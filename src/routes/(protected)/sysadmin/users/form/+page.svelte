<script>
	// @ts-nocheck
	import AdminForm from '$lib/AdminForm.svelte';
	export let data = null;
</script>

<a href="/sysadmin/users">zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/user.json"
	endpoint="/api/users/update"
	initialData={data.user}
/>
