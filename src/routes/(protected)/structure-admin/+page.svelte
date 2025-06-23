<script>
	export let data;
</script>

<h2>ki-app structure-admin</h2>
<a href="/home">zpět</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">label</th>
			<th scope="col"></th>
			<th scope="col"></th>
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
					<a href="/structure-admin/products/{structure.id}">produkty</a>
				</td>
				<td>
					<a href="/structure-admin/attendance?sid={structure.id}">prezenční systém</a>
				</td>
				<td>
					<a href="/structure-admin/users?sid={structure.id}">uživatelé</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
