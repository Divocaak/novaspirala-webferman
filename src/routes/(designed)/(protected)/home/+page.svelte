<script>
	import { User } from '$lib/classes/user';
	import EventCell from '$lib/EventCell.svelte';
	import EventModal from '$lib/EventModal.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	let allDays = [];
	let allVenues = [];
	const dateVenueMap = new Map();

	if (data.events) {
		const events = data.events;

		for (const event of events) {
			const start = new Date(event.date_from);
			const end = new Date(event.date_to);
			const venue = event.vLabel;

			for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86400000)) {
				const dayKey = d.toISOString().slice(0, 10);
				if (!dateVenueMap.has(dayKey)) dateVenueMap.set(dayKey, new Map());

				const venueMap = dateVenueMap.get(dayKey);
				if (!venueMap.has(venue)) venueMap.set(venue, []);
				venueMap.get(venue).push(event);
			}
		}

		allDays = Array.from(dateVenueMap.keys()).sort((a, b) => new Date(a) - new Date(b));
		allVenues = [...new Set(events.map((e) => e.vLabel))].sort();
	}

	const rolesMap = new Map(data.roles.map((role) => [role.id, role]));

	let showModal = false;
	let selectedData = null;

	const openModal = (eventData) => {
		selectedData = eventData.detail;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
		selectedData = null;
	};
</script>

<h2>home</h2>
<br />
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br />{/if}
{#if user.isAllowedToCreate()}<a href="/events">eventy</a><br />{/if}

{#if showModal}<EventModal {selectedData} {closeModal} />{/if}

{#if user.isAllowedToRead()}
	<div class="calendar-grid" style="--venue-count: {allVenues.length}">
		<div class="header">Date</div>
		{#each allVenues as venue}<div class="header">{venue}</div>{/each}
		{#each allDays as date}
			<div class="date-cell">{date}</div>
			{#each allVenues as venue}
				{#if dateVenueMap.has(date) && dateVenueMap.get(date).has(venue)}
					<div class="event-cell stacked-cell">
						{#each dateVenueMap.get(date).get(venue) as ev (ev.id)}
							<EventCell
								event={ev}
								roles={rolesMap}
								on:select={(eventData) => openModal(eventData)}
							/>
						{/each}
					</div>
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

	.stacked-cell {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>
