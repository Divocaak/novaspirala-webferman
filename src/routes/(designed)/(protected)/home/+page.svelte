<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { User } from '$lib/classes/user';
	import EventCalendar from '$lib/calendar/EventCalendar.svelte';
	import EventTable from '$lib/EventTable.svelte';
	import { findInSelect } from '$lib/form/findInSelect.js';
	import StyledSelect from '$lib/form/StyledSelect.svelte';
	import BookingModal from '$lib/modal/BookingModal.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

	const formatDate = (date) => date.toISOString().split('T')[0];

	let filterByDay = false;
	let month_year;

	let filterForm;
	let date_from;
	let date_to;
	let id_venue;
	let id_genre;

	$: {
		const searchParams = $page.url.searchParams;
		const today = new Date();
		const nextMonth = new Date();
		nextMonth.setMonth(today.getMonth() + 1);

		filterByDay = searchParams.get('filterByDay') === 'true';

		date_from = searchParams.get('date_from') ?? formatDate(today);
		date_to = searchParams.get('date_to') ?? formatDate(nextMonth);
		month_year = date_from.slice(0, 7);

		id_venue = findInSelect(data.venues, searchParams.get('id_venue'));
		id_genre = findInSelect(data.genres, searchParams.get('id_genre'));
	}

	let showTable = false;

	function applyFilters(e) {
		e.preventDefault();
		const params = new URLSearchParams();

		params.set('filterByDay', filterByDay);
		if (filterByDay) {
			if (date_from) params.set('date_from', date_from);
			if (date_to) params.set('date_to', date_to);
		} else {
			if (!month_year) return;

			const from = new Date(`${month_year}-01`);
			const to = new Date(from);
			to.setMonth(to.getMonth() + 1);
			params.set('date_from', formatDate(from));
			params.set('date_to', formatDate(to));
		}

		if (id_venue) params.set('id_venue', id_venue.id);
		if (id_genre) params.set('id_genre', id_genre.id);

		goto(`/home?${params.toString()}`);
	}

	let showBookingModal = false;
	let selectedEvent = null;

	const openBookingModal = (eventData) => {
		selectedEvent = eventData;
		showBookingModal = true;
	};

	const closeBookingModal = () => {
		showBookingModal = false;
		selectedEvent = null;
	};
</script>

<h2>home</h2>
<br />
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br />{/if}
{#if user.isAllowedToCreate()}<a href="/form">Přidat event</a><br />{/if}
{#if user.isAllowedToRead()}
	<form bind:this={filterForm} on:submit={applyFilters}>
		<button
			type="button"
			on:click={() => {
				filterByDay = !filterByDay;
				if (!filterByDay) month_year = date_from.slice(0, 7);
				filterForm.requestSubmit();
			}}
		>
			Přepnout na filtrování po {filterByDay ? 'měsících' : 'dnech'}
		</button><br />
		{#if filterByDay}
			<label for="date_from">* Od</label>
			<input
				id="date_from"
				type="date"
				bind:value={date_from}
				required
				on:change={() => {
					date_to = date_from;
					filterForm.requestSubmit();
				}}
			/>
			<br />
			<label for="date_to">* Do</label>
			<input
				id="date_to"
				type="date"
				bind:value={date_to}
				required
				on:change={() => filterForm.requestSubmit()}
			/>
		{:else}
			<label for="month_year">* Měsíc</label>
			<input
				id="month_year"
				type="month"
				bind:value={month_year}
				required
				on:change={() => filterForm.requestSubmit()}
			/>
		{/if}
		<br />
		<StyledSelect
			label="Prostor"
			id="id_venue"
			bind:value={id_venue}
			options={data.venues}
			on:change={() => filterForm.requestSubmit()}
		/>
		<StyledSelect
			label="Žánr/typ"
			id="id_genre"
			bind:value={id_genre}
			options={data.genres}
			on:change={() => filterForm.requestSubmit()}
		/>
		<button type="submit" hidden>Použít filtry</button>
	</form>
	<button on:click={(showTable = !showTable)}>{showTable ? 'Kalendář' : 'Tabulka'}</button>
	{#if !showTable}
		<EventCalendar
			events={data.events}
			roles={data.roles}
			{date_from}
			{date_to}
			{user}
			{startOfDay}
			openBookingModalFunction={openBookingModal}
		/>
	{:else}
		<EventTable
			events={data.events}
			roles={data.roles}
			{user}
			{startOfDay}
			openBookingModalFunction={openBookingModal}
		/>
	{/if}

	{#if showBookingModal}
		<BookingModal {selectedEvent} closeModalFunction={closeBookingModal} {user} />
	{/if}
{/if}
