<script>
	// @ts-nocheck
	export let data = null;

	const links = data.userStructures.reduce((acc, link) => {
		acc[link.id_structure] = link.active;
		return acc;
	}, {});
	const updates = [];

	async function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;

		const response = await fetch(`/api/userStructures/set`, {
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
		updates.push({ structureId: Number(event.target.name), active: event.target.checked });
	}
</script>

<a href="/sysadmin/users">zpět</a><br />

<h2>přiřazení k budovám</h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>budova</th>
				<th>přiřazení</th>
			</tr>
		</thead>
		<tbody>
			{#each data.structures as structure}
				<tr>
					<td>{structure.label}</td>
					<td>
						<input
							type="checkbox"
							name={structure.id}
							checked={links[structure.id] || false}
							on:change={handleChange}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="uložit" />
</form>
