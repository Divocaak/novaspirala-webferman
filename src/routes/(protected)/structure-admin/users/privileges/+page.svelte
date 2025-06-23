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

	const initialCheckedPrivileges = data.userPrivileges.filter((up) => up.active);
	let checkedPrivileges = writable([...data.userPrivileges]);
	let privilegeChanges = writable({});
	function togglePrivilege(privilegeId, event) {
		let isChecked = event.target.checked;
		privilegeChanges.update((changes) => {
			const wasInitially =
				initialCheckedPrivileges.some((up) => up.id_privilege === privilegeId) === isChecked;
			if (wasInitially)
				delete changes[privilegeId]; // Reverted change → remove from updates
			else
				changes[privilegeId] = {
					id_structure: parseInt(data.sid),
					id_privilege: privilegeId,
					active: +isChecked
				}; // Store change

			return changes;
		});

		checkedPrivileges.update((current) =>
			isChecked
				? [...current, { id_privilege: privilegeId }]
				: current.filter((up) => up.id_privilege !== privilegeId)
		);
	}
</script>

<a href="/structure-admin/users?sid={data.sid}">zpět</a><br />

<!-- NOTE get users fullname and structLabel  -->
<h2>práva <i>uid: {data.uid}</i> v <i>sid: {data.sid}</i></h2>
<form on:submit={handleSubmit}>
	<input readonly id="uid" name="uid" value={data.uid} style="display:none" />
	<table>
		<thead>
			<tr>
				<th>privilege</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.privileges as priv}
				<tr>
					<td>{priv.id}: {priv.label} </td>
					<td>
						<input
							type="checkbox"
							name={priv.id}
							checked={$checkedPrivileges.some((up) => up.id_privilege === priv.id && up.active)}
							on:change={() => togglePrivilege(priv.id, event)}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="submit" value="uložit" />
</form>
