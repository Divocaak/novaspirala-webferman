<script>
	import Tooltip from '$lib/Tooltip.svelte';
	import Pill from '$lib/Pill.svelte';
	import TooltipUser from '$lib/TooltipUser.svelte';
	import TooltipVenue from '$lib/TooltipVenue.svelte';
	import TooltipGenre from '$lib/TooltipGenre.svelte';
	import LocalisedDateRange from '$lib/LocalisedDateRange.svelte';
	import EventDeleteButton from './EventDeleteButton.svelte';

	export let events;
	export let roles;
	export let user;
</script>

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
		</tr>
	</thead>
	<tbody>
		{#each events as event}
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
				<td>
					<LocalisedDateRange from={event.date_from} to={event.date_to} />
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
				{#if user.isAllowedToEdit(event.createdById)}
					<td>
						<a href="/form?id={event.id}">Upravit</a>
					</td>
				{/if}
				{#if user.isAllowedToDelete(event.createdById)}
					<td>
						<EventDeleteButton id={event.id} />
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>
