<script>
	export let data;
</script>

<h2>Uživatelé</h2>
<a href="/sysadmin">Zpět</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Login</th>
			<th scope="col">Celé jméno</th>
			<th scope="col">E-mail</th>
			<th scope="col">Telefon</th>
			<th scope="col"></th>
			<th scope="col"></th>
			<th scope="col"></th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.users as user}
			<tr>
				<td>
					{user.id}
				</td>
				<td>
					{user.login}
				</td>
				<td>
					<b>{user.l_name}</b>
					{user.f_name}
				</td>
				<td>
					<a href="mailto:{user.email}">{user.email}</a>
				</td>
				<td>
					<a href="tel:{user.phone}">{user.phone}</a>
				</td>
				<td>
					<a href="/sysadmin/users/form?id={user.id}">Upravit</a>
				</td>
				<td>
					<a href="/sysadmin/users/changePassword?id={user.id}">Změnit heslo</a>
				</td>
				<td>
					<a href="/sysadmin/users/privileges?uid={user.id}">Práva</a>
				</td>
				<td>
					<a href="/sysadmin/users/roles?uid={user.id}">Role</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
