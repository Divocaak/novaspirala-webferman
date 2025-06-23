<script>
	export let data;
</script>

<h2>budovy</h2>
<a href="/sysadmin">zpět</a><br />
<a href="/sysadmin/structures/form">přidat novou</a>

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
					<a href="/sysadmin/structures/form?id={structure.id}">upravit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
