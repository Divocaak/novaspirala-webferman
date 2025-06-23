<script>
	export let data;
</script>

<h2>uživatelé</h2>
<a href="/structure-admin">zpět</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">lname fname</th>
			<th scope="col">email</th>
			<th scope="col">phone</th>
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
					<a href="/structure-admin/users/privileges?uid={user.id}&sid={data.sid}">práva</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
