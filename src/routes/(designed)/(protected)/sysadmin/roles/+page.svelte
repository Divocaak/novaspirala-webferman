<script>
	export let data;
</script>

<h2>Role</h2>
<a href="/sysadmin">Zpět</a><br />
<a href="/sysadmin/roles/form">Přidat</a>

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Název</th>
			<th scope="col">Poznámka</th>
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
					<a href="/sysadmin/roles/form?id={role.id}">Upravit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
