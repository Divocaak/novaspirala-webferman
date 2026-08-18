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
	import EventFilesButton from './buttons/EventFilesButton.svelte';
	import { onMount } from 'svelte';
	import { getLocalisedDate } from './locale/localisedDateRangeText';

	export let events;
	export let roles;
	export let vacations = [];
	export let user;
	export let startOfDay;
	export let date_from;
	export let date_to;
	export let showEmptyDays = false;
	export let openBookingModalFunction;

	let eventsAsc = true;

	function toLocalISO(date) {
		const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return offsetDate.toISOString().slice(0, 10);
	}

	$: sortedEvents = [...events].sort(
		(a, b) =>
			new Date(eventsAsc ? a.date_from : b.date_from) -
			new Date(eventsAsc ? b.date_from : a.date_from)
	);

	$: vacationMap = new Map();
	$: {
		vacationMap.clear();

		for (const vacation of vacations) {
			const start = new Date(vacation.date_from);
			const end = new Date(vacation.date_to);

			for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86400000)) {
				const day = toLocalISO(d);

				if (!vacationMap.has(day)) {
					vacationMap.set(day, []);
				}

				vacationMap.get(day).push(vacation);
			}
		}
	}

	$: tableRows = (() => {
		const rows = sortedEvents.map((event) => ({
			type: 'event',
			date: toLocalISO(new Date(event.date_from)),
			event
		}));

		// empty days
		if (showEmptyDays && date_from && date_to) {
			const eventDays = new Set();

			for (const event of events) {
				const start = new Date(event.date_from);
				const end = new Date(event.date_to);

				for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86400000)) {
					eventDays.add(toLocalISO(d));
				}
			}

			const start = new Date(`${date_from}T00:00:00`);
			const end = new Date(`${date_to}T00:00:00`);

			for (let d = new Date(start); d < end; d = new Date(d.getTime() + 86400000)) {
				const day = toLocalISO(d);

				if (!eventDays.has(day)) {
					rows.push({
						type: 'empty',
						date: day
					});
				}
			}
		}

		return rows.sort((a, b) => {
			const dateComparison = new Date(a.date) - new Date(b.date);

			if (dateComparison !== 0) return eventsAsc ? dateComparison : -dateComparison;

			// If an empty day and an event have the same date, put the event first.
			if (a.type === 'event' && b.type !== 'event') return -1;
			if (a.type !== 'event' && b.type === 'event') return 1;

			return 0;
		});
	})();

	let table;

	function updateSticky() {
		const ths = table.querySelectorAll('thead th');
		if (ths.length < 4) return;

		const col3Width = ths[2].offsetWidth;

		table.style.setProperty('--col3-width', `${col3Width}px`);
	}

	onMount(() => {
		updateSticky();

		const observer = new ResizeObserver(() => {
			updateSticky();
		});

		observer.observe(table);

		table.querySelectorAll('thead th').forEach((th) => {
			observer.observe(th);
		});

		return () => observer.disconnect();
	});
</script>

<p style="padding-top: 50px;">
	Řadit <button on:click={(eventsAsc = !eventsAsc)}>{eventsAsc ? 'sestupně' : 'vzestupně'}</button>
</p>
<ExportToExcelButton events={sortedEvents} {roles} />
<table bind:this={table}>
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
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each tableRows as row}
			{#if row.type === 'event'}
				{@const event = row.event}
				{@const day = toLocalISO(new Date(event.date_from))}

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

						{#if vacationMap.has(day)}
							<div class="vacations">
								{#each vacationMap.get(day) as vacation (vacation.id)}
									<TooltipUser
										l_name={vacation.l_name}
										f_name={vacation.f_name}
										email={vacation.email}
										phone={vacation.phone}
										{user}
									/>
								{/each}
							</div>
						{/if}
					</td>
					<td class="desc-cell">
						<div class="desc">
							{event.description}
						</div>
					</td>
					<td>
						<TooltipUser
							l_name={event.l_name}
							f_name={event.f_name}
							email={event.email}
							phone={event.phone}
							{user}
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
							{#each event.users.filter((user) => user.id_role === role.id) as userInEvent}
								<p>
									<TooltipUser
										l_name={userInEvent.l_name}
										f_name={userInEvent.f_name}
										email={userInEvent.email}
										phone={userInEvent.phone}
										{user}
									/>
									{#if userInEvent.note}({userInEvent.note}){/if}
								</p>
							{/each}
						</td>
					{/each}

					<td>
						<EventEditButton id={event.id} {user} />
					</td>
					<td>
						<EventDeleteButton
							id={event.id}
							createdById={event.createdById}
							{user}
							pastEditable={event.date_from_ts >= startOfDay}
						/>
					</td>
					<td>
						<EventBookButton
							id={event.id}
							{user}
							pastBookable={event.date_from_ts >= startOfDay}
							openModalFunction={() => openBookingModalFunction(event)}
						/>
					</td>
					<td>
						<EventFilesButton id={event.id} />
					</td>
				</tr>
			{:else}
				<tr class="empty-day-row">
					<td>x</td>
					<td>x</td>
					<td>Žádná událost</td>
					<td>
						{getLocalisedDate(row.date, false)}

						{#if vacationMap.has(row.date)}
							<div class="vacations">
								{#each vacationMap.get(row.date) as vacation (vacation.id)}
									<TooltipUser
										l_name={vacation.l_name}
										f_name={vacation.f_name}
										email={vacation.email}
										phone={vacation.phone}
										{user}
									/>
								{/each}
							</div>
						{/if}
					</td>
					<td colspan={8 + roles.length}>x</td>
				</tr>
			{/if}
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

	/* :global(body) {
		overflow: auto;
	} */

	th:nth-child(3),
	td:nth-child(3),
	th:nth-child(4),
	td:nth-child(4) {
		position: sticky;
		background-color: inherit;
		z-index: 6;
	}

	th:nth-child(3),
	td:nth-child(3) {
		left: 0;
	}

	th:nth-child(4),
	td:nth-child(4) {
		left: var(--col3-width);
	}

	.empty-day-row td {
		text-align: center;
		padding: 1rem;
		color: #888;
		font-style: italic;
	}

	.empty-day-row td:last-child {
		text-align: left;
	}

	.vacations {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.2rem;

		font-weight: normal;
		font-size: 0.8rem;
		background: #ff6961;
		color: #fff;
		padding: 2px 4px;
		border-radius: 3px;

		width: fit-content;
		font-style: normal;
	}
</style>
