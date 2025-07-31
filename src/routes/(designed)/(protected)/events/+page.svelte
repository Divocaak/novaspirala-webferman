<!-- TODO merge to home screen with switch (show table or calendar) -->
<script>
	import { getLocalisedDate } from '$lib/dateParser';
	import { User } from '$lib/classes/user.js';
	import Tooltip from '$lib/Tooltip.svelte';
	import Pill from '$lib/Pill.svelte';
	import TooltipUser from '$lib/TooltipUser.svelte';
	import TooltipVenue from '$lib/TooltipVenue.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const deleteEvent = async (eventId) => {
		if (!confirm('Delete event?')) return;

		const deleteResult = await fetch(`/api/events/delete?id=${eventId}`);
		const response = await deleteResult.json();

		if (response.status == 200) {
			alert(response.message);
			/* TODO reload page */
		} else {
			console.log(response.message);
			alert('error');
		}
	};
</script>

<h2>eventy</h2>
<a href="/home">zpět</a><br />
<a href="/events/form">add</a>

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">id_order</th>
			<th scope="col">label</th>
			<th scope="col">date(s)</th>
			<th scope="col">description</th>
			<th scope="col">created_by</th>
			<th scope="col">venue</th>
			<th scope="col">genre</th>
			{#each data.roles as role}
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
		{#each data.events as event}
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
					{getLocalisedDate(event.date_from)} - {getLocalisedDate(event.date_to)}
				</td>
				<td>
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
				<td class="tooltip" style="background-color: {event.gBgClr}">
					<b style="color: {event.gTxtClr}">{event.gLabel}</b>&nbsp;(?)
					<span class="tooltip-text">{event.note}</span>
				</td>
				{#each data.roles as role}
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
						<a href="/events/form?id={event.id}">edit</a>
					</td>
				{/if}
				{#if user.isAllowedToDelete(event.createdById)}
					<td>
						<button class="delete-btn" on:click={() => deleteEvent(event.id)}>delete</button>
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.tooltip .tooltip-text {
		visibility: hidden;
		background-color: #1e1e1e;
		color: #fff;
		text-align: center;
		padding: 0.5rem;
		border-radius: 6px;

		width: max-content;
		max-width: 300px;

		position: absolute;
		bottom: 100%;
		left: 0%;
		z-index: 100;

		opacity: 0;
		transition: all 0.2s ease-in-out;
	}

	.tooltip:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
		font-weight: normal;
	}

	.delete-btn {
		all: unset;
		cursor: pointer;
		color: #5755d9;
	}
</style>
