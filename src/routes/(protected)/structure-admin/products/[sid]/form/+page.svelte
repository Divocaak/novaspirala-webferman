<script>
	// @ts-nocheck
	import AdminForm from '$lib/AdminForm.svelte';
	import { page } from '$app/stores';
	export let data = null;

	const initialData = data.product ?? {};
	initialData.id_structure = $page.params.sid;
</script>

<h2>produkty</h2>
<a href="/structure-admin/products/{$page.params.sid}">zpět</a><br />

<AdminForm
	schemaPath="/schemas/admin/product.json"
	endpoint="/api/products/{data.product ? 'update' : 'add'}"
	{initialData}
/>
