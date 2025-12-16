<script>
	import EventCell from '$lib/calendar/EventCell.svelte';
	import EventModal from '$lib/modal/EventModal.svelte';

	export let events = null;
	export let roles = null;
	export let date_from;
	export let date_to;
	export let user;
	export let startOfDay;
	export let openBookingModalFunction;

	function toLocalISO(date) {
		const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return offsetDate.toISOString().slice(0, 10);
	}

	let allDays = [];
	let allVenues = [];
	const dateVenueMap = new Map();
	$: if (events) {
		dateVenueMap.clear();

		const visibleStart = new Date(date_from); // From search param
		const visibleEnd = new Date(date_to); // To search param
		for (const event of events) {
			const start = new Date(event.date_from);
			const end = new Date(event.date_to);
			const venue = event.vLabel;

			const effectiveStart = new Date(Math.max(start, visibleStart));
			const effectiveEnd = new Date(Math.min(end, visibleEnd));

			for (
				let d = new Date(effectiveStart);
				d <= effectiveEnd;
				d = new Date(d.getTime() + 86400000)
			) {
				const dayKey = toLocalISO(d);
				if (!dateVenueMap.has(dayKey)) dateVenueMap.set(dayKey, new Map());

				const venueMap = dateVenueMap.get(dayKey);
				if (!venueMap.has(venue)) venueMap.set(venue, []);
				venueMap.get(venue).push(event);
			}
		}

		allDays = Array.from(dateVenueMap.keys()).sort((a, b) => new Date(a) - new Date(b));
		allVenues = [...new Set(events.map((e) => e.vLabel))].sort();
	}

	$: rolesMap = new Map(roles.map((role) => [role.id, role]));

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

{#if showModal}
	<EventModal {selectedData} closeModalFunction={closeModal} {user} {startOfDay} {openBookingModalFunction}/>
{/if}

<div class="calendar-grid" style="--venue-count: {allVenues.length}">
	<div class="header">Datum</div>
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

<style>
	.calendar-grid {
		display: grid;
		grid-template-columns: 150px repeat(var(--venue-count), minmax(150px, 1fr));
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
		opacity: 0.5;
		min-height: 1rem;
	}

	.stacked-cell {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 1px;
	}
</style>
