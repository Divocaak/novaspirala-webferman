<script>
	export let data = null;

	const links = data.userPrivileges.reduce((acc, link) => {
		acc[link.id_privilege] = link.active;
		return acc;
	}, {});
	const updates = [];

	async function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;

		const response = await fetch(`/api/userPrivileges/set`, {
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

<a href="/sysadmin/users">Zpět</a><br />

<h2>Práva</h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>Práva</th>
				<th>Přiřazení</th>
				<th>Popis</th>
			</tr>
		</thead>
		<tbody>
			{#each data.privileges as privilege}
				<tr>
					<td style="color: {privilege.txtClr}; background-color: {privilege.bgClr}">{privilege.label}</td>
					<td>
						<input
							type="checkbox"
							name={privilege.id}
							checked={links[privilege.id] || false}
							on:change={handleChange}
						/>
					</td>
					<td>{privilege.note}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="Uložit" />
</form>
