<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import selected from '$lib/stores/structureStore.js';
	export let data;

	function manage(sid) {
		selected.update(() => sid);
		goto('/bartender/manage');
	}
</script>

<h2>bartender</h2>
<a href="/home">back to home</a><br />


<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">label</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.structures as structure}
			<tr>
				<td>
					{structure.id}
				</td>
				<td>
					<b>{structure.label}</b>
				</td>
				<td>
					<button on:click={() => manage(structure.id)}>manage bills</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
