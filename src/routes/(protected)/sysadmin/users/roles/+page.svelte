<script>
	export let data = null;

	const links = data.userRoles.reduce((acc, link) => {
		acc[link.id_role] = link.active;
		return acc;
	}, {});
	const updates = [];

	async function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;

		const response = await fetch(`/api/userRoles/set`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ uid: form.uid.value, updates: updates })
		});

		const result = await response.json();
		alert(result.message);
	}

	function handleChange(event) {
		updates.push({ roleId: Number(event.target.name), active: event.target.checked });
	}
</script>

<a href="/sysadmin/users">zpět</a><br />

<h2>role</h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>role</th>
				<th>přiřazení</th>
			</tr>
		</thead>
		<tbody>
			{#each data.roles as role}
				<tr>
					<td style="color: {role.txtClr}; background-color: {role.bgClr}">{role.label}</td>
					<td>
						<input
							type="checkbox"
							name={role.id}
							checked={links[role.id] || false}
							on:change={handleChange}
						/>
					</td>
					<td>{role.note}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="uložit" />
</form>
