<script>
	import { invalidateAll } from '$app/navigation';
	import { User } from '$lib/classes/user.js';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText.js';
	import Pill from '$lib/Pill.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	async function editStatus(id, statusId) {
		const sid = statusId == 3 ? 1 : statusId + 1;
		const res = await fetch('/api/itTasks/updateStatus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_task: id,
				id_status: sid
			})
		});

		if (!res.ok) alert('Chyba při úpravě stavu');
		await invalidateAll();
	}

	async function editNote(id, currentNote) {
		let note = await prompt('Poznámka: ', currentNote);

		const res = await fetch('/api/itTasks/updateNote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_task: id,
				note
			})
		});

		if (!res.ok) alert('Chyba při ukládání poznámky');
		await invalidateAll();
	}
</script>

<a href="/">zpět</a><br />
<h2>IT podpora</h2>

{#if user.isAllowedToITSupport()}<a href="/itsupport/form">Přidat požadavek</a><br />{/if}

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Název</th>
			<th scope="col">Popis</th>
			<th scope="col">Datum vytvoření</th>
			<th scope="col">Vytvořil</th>
			<th scope="col">Stav</th>
			<th scope="col">Datum změny stavu</th>
			{#if user.isSysAdmin()}
				<th scope="col">Sysadmin poznámka</th>
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each data.tasks as task}
			<tr>
				<td>
					{task.id}
				</td>
				<td>
					{task.label}
				</td>
				<td class="desc-cell">
					<div class="desc">
						{task.description}
					</div>
				</td>
				<td class="cell-max">
					{getLocalisedDate(task.created_at, false)}
				</td>
				<td>
					<TooltipUser
						l_name={task.l_name}
						f_name={task.f_name}
						email={task.email}
						phone={task.phone}
						{user}
					/>
				</td>
				<td>
					<Pill label={task.sLabel} txtClr={task.sTxtClr} bgClr={task.sBgClr} />
					{#if user.isSysAdmin()}<button
							style="text-wrap: nowrap"
							on:click={editStatus(task.id, task.id_status)}>Změnit stav</button
						>{/if}
				</td>
				<td class="cell-max">
					{#if task.status_modified_at !== null}
						{getLocalisedDate(task.status_modified_at, false)}
					{/if}
				</td>
				{#if user.isSysAdmin()}
					<td class="desc-cell">
						<div class="desc">
							{task.sysadmin_note}
						</div>
						<button on:click={editNote(task.id, task.sysadmin_note ?? '')}>Upravit poznámku</button>
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		table-layout: fixed;
		width: 100%;
		/* width: fit-content; */
	}

	.cell-max {
		text-wrap: nowrap;
	}

	.desc-cell {
		width: 350px;
		max-width: 350px;
		padding: 0;
	}

	.desc-cell .desc {
		width: 350px;
		max-height: 200px;
		padding: 8px;

		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;

		white-space: pre-line;
	}

	td button {
	}
</style>
