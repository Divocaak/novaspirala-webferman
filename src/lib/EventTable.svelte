<script>
	import Tooltip from '$lib/tooltip/Tooltip.svelte';
	import Pill from '$lib/Pill.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';
	import TooltipVenue from '$lib/tooltip/TooltipVenue.svelte';
	import TooltipGenre from '$lib/tooltip/TooltipGenre.svelte';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';
	import EventDeleteButton from '$lib/buttons/EventDeleteButton.svelte';
	import ExportToExcelButton from '$lib/buttons/ExportToExcelButton.svelte';
	import EventEditButton from '$lib/buttons/EventEditButton.svelte';
	import EventBookButton from '$lib/buttons/EventBookButton.svelte';

	export let events;
	export let roles;
	export let user;
	export let startOfDay;
	export let openBookingModalFunction;

	let eventsAsc = true;
	$: sortedEvents = [...events].sort(
		(a, b) =>
			new Date(eventsAsc ? a.date_from : b.date_from) -
			new Date(eventsAsc ? b.date_from : a.date_from)
	);
</script>

<p style="padding-top: 50px;">
	Řadit <button on:click={(eventsAsc = !eventsAsc)}>{eventsAsc ? 'sestupně' : 'vzestupně'}</button>
</p>
<ExportToExcelButton events={sortedEvents} {roles} />
<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">ID Objednávky</th>
			<th scope="col">Název</th>
			<th scope="col">Datum</th>
			<th scope="col">Popis</th>
			<th scope="col">Vytvořil</th>
			<th scope="col">Prostor</th>
			<th scope="col">Žánr/typ</th>
			{#each roles as role}
				<th scope="col">
					<Tooltip>
						<Pill bgClr={role.bgClr} txtClr={role.txtClr} label="{role.label}&nbsp;(?)"></Pill>
						<span slot="tooltip">{role.note}</span>
					</Tooltip>
				</th>
			{/each}
			<th scope="col"></th>
			<th scope="col"></th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each sortedEvents as event}
			<tr>
				<td>
					{event.id}
				</td>
				<td>
					{event.id_order}
				</td>
				<td style="background-color: {event.bgClr}">
					<b style="color: {event.txtClr}">{event.label}</b>
				</td>
				<td class="cell-max">
					<LocalisedDateRange from={event.date_from} to={event.date_to} wrap={true} />
				</td>
				<td style="white-space: pre-line;">
					{event.description}
				</td>
				<td>
					<TooltipUser
						l_name={event.l_name}
						f_name={event.f_name}
						login={event.login}
						email={event.email}
						phone={event.phone}
					/>
				</td>
				<td>
					<TooltipVenue
						bgClr={event.vBgClr}
						txtClr={event.vTxtClr}
						label={event.vLabel}
						addr_label={event.addr_label}
						addr_street={event.addr_street}
						addr_postal={event.addr_postal}
						addr_town={event.addr_town}
						addr_country_code={event.addr_country_code}
					/>
				</td>
				<td>
					<TooltipGenre
						bgClr={event.gBgClr}
						txtClr={event.gTxtClr}
						label={event.gLabel}
						note={event.note}
					/>
				</td>
				{#each roles as role}
					<td>
						{#each event.users.filter((user) => user.id_role === role.id) as user}
							<TooltipUser
								l_name={user.l_name}
								f_name={user.f_name}
								login={user.login}
								email={user.email}
								phone={user.phone}
							/>
						{/each}
					</td>
				{/each}
				<td>
					<EventEditButton id={event.id} {user} pastEditable={event.date_from_ts >= startOfDay} />
				</td>
				<td>
					<EventDeleteButton id={event.id} {user} pastEditable={event.date_from_ts >= startOfDay} />
				</td>
				<td>
					<EventBookButton
						id={event.id}
						{user}
						pastBookable={event.date_from_ts >= startOfDay}
						openModalFunction={() => openBookingModalFunction(event)}
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.cell-max {
		text-wrap: nowrap;
	}
</style>
