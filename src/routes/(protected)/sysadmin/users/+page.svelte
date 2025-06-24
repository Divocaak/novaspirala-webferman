<script>
	export let data;
</script>

<h2>uživatelé</h2>
<a href="/sysadmin">zpět</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">login</th>
			<th scope="col">lname fname</th>
			<th scope="col">email</th>
			<th scope="col">phone</th>
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
					<a href="/sysadmin/users/form?id={user.id}">upravit</a>
				</td>
				<td>
					<a href="/sysadmin/users/changePassword?id={user.id}">změnit heslo</a>
				</td>
				<td>
					<a href="/sysadmin/users/privileges?uid={user.id}">práva</a>
				</td>
				<td>
					<a href="/sysadmin/users/roles?uid={user.id}">role</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
