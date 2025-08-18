<script>
	export let data = null;

	const links = data.userRoles.reduce((acc, link) => {
		acc[link.id_role] = { active: link.active, manager: link.manager };
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
		updates.length = 0;
	}

	function handleChange(event) {
		const roleId = Number(event.target.dataset.roleid);
		const type = event.target.dataset.type;
		const checked = event.target.checked;

		const existing = updates.find((u) => u.roleId === roleId);
		if (existing) {
			existing[type] = checked;
		} else {
			updates.push({
				roleId,
				active: type === 'active' ? checked : links[roleId]?.active || false,
				manager: type === 'manager' ? checked : links[roleId]?.manager || false
			});
		}
	}
</script>

<a href="/sysadmin/users">Zpět</a><br />

<h2>Role</h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>Role</th>
				<th>Přiřazení</th>
				<th>Vedoucí</th>
				<th>Popis</th>
			</tr>
		</thead>
		<tbody>
			{#each data.roles as role}
				<tr>
					<td style="color: {role.txtClr}; background-color: {role.bgClr}">{role.label}</td>
					<td>
						<input
							type="checkbox"
							name="active-{role.id}"
							data-roleid={role.id}
							data-type="active"
							checked={links[role.id]?.active || false}
							on:change={handleChange}
						/>
					</td>
					<td>
						<input
							type="checkbox"
							name="manager-{role.id}"
							data-roleid={role.id}
							data-type="manager"
							checked={links[role.id]?.manager || false}
							on:change={handleChange}
						/>
					</td>
					<td>{role.note}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="Uložit" />
</form>
