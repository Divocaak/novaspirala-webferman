<script>
	export let data;
</script>

<h2>roles</h2>
<a href="/sysadmin">zpět</a><br />
<a href="/sysadmin/roles/form">add</a>

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">label</th>
			<th scope="col">note</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.roles as role}
			<tr>
				<td>
					{role.id}
				</td>
				<td style="background-color: {role.bgClr}">
					<b style="color: {role.txtClr}">{role.label}</b>
				</td>
				<td>
					{role.note}
				</td>
				<td>
					<a href="/sysadmin/roles/form?id={role.id}">edit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
