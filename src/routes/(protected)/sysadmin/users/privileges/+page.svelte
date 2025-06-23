<script>
	// @ts-nocheck
	import { writable, derived } from 'svelte/store';
	export let data = null;

	async function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;
		const response = await fetch(`/api/userPrivileges/set`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ uid: form.uid.value, updates: $privilegeChanges })
		});

		const result = await response.json();
		alert(result.message);
	}

	// Store initially checked privileges
	const initialCheckedPrivileges = data.userPrivileges
		.filter((up) => up.active)
		.map((up) => ({ id_structure: up.id_structure, id_privilege: up.id_privilege }));
	let checkedPrivileges = writable([...initialCheckedPrivileges]);

	// Single object to track changes (additions & removals)
	let privilegeChanges = writable({});

	function togglePrivilege(structureId, privilegeId, event) {
		let isChecked = event.target.checked;
		let key = `${structureId}-${privilegeId}`;

		privilegeChanges.update((changes) => {
			const wasInitially =
				initialCheckedPrivileges.some(
					(up) => up.id_structure === structureId && up.id_privilege === privilegeId
				) === isChecked;
			if (wasInitially)
				delete changes[key]; // Reverted change → remove from updates
			else
				changes[key] = { id_structure: structureId, id_privilege: privilegeId, active: +isChecked }; // Store change

			return changes;
		});

		checkedPrivileges.update((current) =>
			isChecked
				? [...current, { id_structure: structureId, id_privilege: privilegeId }]
				: current.filter((up) => up.id_structure !== structureId || up.id_privilege !== privilegeId)
		);
	}
</script>

<a href="/sysadmin/users">zpět</a><br />

<h2>práva v rámci budov</h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>Structure</th>
				{#each data.privileges as priv}
					<th>{priv.id}: {priv.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data.structures as structure}
				<tr>
					<td>{structure.id}: {structure.label}</td>
					{#each data.privileges as priv}
						<td>
							<input
								type="checkbox"
								checked={$checkedPrivileges.some(
									(up) => up.id_structure === structure.id && up.id_privilege === priv.id
								)}
								on:change={() => togglePrivilege(structure.id, priv.id, event)}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="uložit" />
</form>
