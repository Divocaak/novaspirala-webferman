<script>
	import { User } from '$lib/classes/user.js';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';
	import Pill from '$lib/Pill.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<a href="/">zpět</a><br />
<h2>Dovolená</h2>
<a href="/vacation/form">Zapsat dovolenou</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Jméno</th>
			<th scope="col">Od do</th>
		</tr>
	</thead>
	<tbody>
		{#each data.vacations as vacation}
			<tr>
				<td>
					{vacation.id}
				</td>
				<td>
					<TooltipUser
						l_name={vacation.l_name}
						f_name={vacation.f_name}
						email={vacation.email}
						phone={vacation.phone}
						{user}
					/>
				</td>
				<td class="cell-max">
					<LocalisedDateRange
						from={vacation.date_from}
						to={vacation.date_to}
						wrap={true}
						hours={false}
					/>
				</td>
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
</style>
