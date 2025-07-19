<script>
	import { User } from '$lib/classes/user';
	import EventCell from '$lib/EventCell.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	let allDays = [];
	let allVenues = [];
	const dateVenueMap = new Map();
	if (data.events) {
		const events = data.events; // your event array

		for (const event of events) {
			const start = new Date(event.date_from);
			const end = new Date(event.date_to);
			const venue = event.vLabel;

			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				const dayKey = d.toISOString().split('T')[0];
				if (!dateVenueMap.has(dayKey)) dateVenueMap.set(dayKey, new Map());
				const venueMap = dateVenueMap.get(dayKey);
				if (!venueMap.has(venue)) venueMap.set(venue, []);
				venueMap.get(venue).push(event);
			}
		}

		// Step 2: Build sorted rows and columns
		allDays = Array.from(dateVenueMap.keys()).sort();
		allVenues = [...new Set(events.map((e) => e.vLabel))].sort();
	}

	const visibleEventMap = new Map();
	const skippedCells = new Set();

	for (const ev of data.events) {
		const start = new Date(ev.date_from);
		const end = new Date(ev.date_to);
		const span = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

		const dateKey = start.toISOString().slice(0, 10);
		const venueKey = ev.vLabel;
		const mapKey = `${dateKey}|${venueKey}`;
		visibleEventMap.set(mapKey, { ...ev, daySpan: span });

		// Skip all subsequent days this event covers
		for (let i = 1; i < span; i++) {
			const d = new Date(start);
			d.setDate(d.getDate() + i);
			const skipKey = `${d.toISOString().slice(0, 10)}|${venueKey}`;
			skippedCells.add(skipKey);
		}
	}
</script>

<h2>home</h2>
<br />
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br />{/if}
{#if user.isAllowedToCreate()}<a href="/events">eventy</a><br />{/if}
{#if user.isAllowedToRead()}
	<div class="calendar-grid" style="--venue-count: {allVenues.length}">
		<div class="header">Date</div>
		{#each allVenues as venue}
			<div class="header">{venue}</div>
		{/each}
		{#each allDays as date}
			<div class="date-cell">{date}</div>
			{#each allVenues as venue}
				{#if visibleEventMap.has(`${date}|${venue}`)}
					<EventCell event={visibleEventMap.get(`${date}|${venue}`)} />
				{:else if skippedCells.has(`${date}|${venue}`)}
					<!-- Skip rendering: cell is part of a rowspan event above -->
				{:else}
					<div class="event-cell empty-cell"></div>
				{/if}
			{/each}
		{/each}
	</div>
{/if}

<style>
	.calendar-grid {
		display: grid;
		grid-template-columns: 150px repeat(var(--venue-count), 1fr);
		gap: 4px;
	}

	.header {
		font-weight: bold;
		text-align: center;
		padding: 0.5rem;

		background: #f0f0f0;
		position: sticky;

		top: 0;
		z-index: 1;
	}

	.date-cell {
		font-weight: bold;
		text-align: right;
		padding: 0.5rem;

		background: #f0f0f0;
	}

	.empty-cell {
		background: #f9f9f9;
		min-height: 1rem;
	}
</style>
