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

	$: params = $page.url.searchParams;
	$: filterByDay = params.get('filterByDay') === 'true';
	$: {
		const today = new Date();
		const nextMonth = new Date();
		nextMonth.setMonth(today.getMonth() + 1);

		date_from = params.get('date_from') ?? formatDate(today);
		date_to = params.get('date_to') ?? formatDate(nextMonth);
		month_year = date_from.slice(0, 7);

		id_venue = findInSelect(data.venues, params.get('id_venue'));
		id_genre = findInSelect(data.genres, params.get('id_genre'));
	}

	let date_from, date_to, month_year, id_venue, id_genre;

	function updateParams(updates) {
		const next = new URLSearchParams(params);

		for (const [key, value] of Object.entries(updates)) {
			if (!value) next.delete(key);
			else next.set(key, value);
		}

		goto(`/home?${next.toString()}`);
	}

	function setDayFilter(enabled) {
		if (enabled) {
			updateParams({ filterByDay: 'true' });
		} else {
			const from = new Date(`${month_year}-01`);
			const to = new Date(from);
			to.setMonth(to.getMonth() + 1);

			updateParams({
				filterByDay: 'false',
				date_from: formatDate(from),
				date_to: formatDate(to)
			});
		}
	}

	let showTable = false;

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
	<button on:click={() => setDayFilter(!filterByDay)}>
		Přepnout na filtrování po {filterByDay ? 'měsících' : 'dnech'}
	</button><br />
	{#if filterByDay}
		<label>
			* Od
			<input
				type="date"
				value={date_from}
				on:input={(e) => {
					const v = e.target.value;
					updateParams({ date_from: v, date_to: v });
				}}
			/>
		</label>
		<label>
			* Do
			<input
				type="date"
				value={date_to}
				on:input={(e) => {
					updateParams({ date_to: e.target.value });
				}}
			/>
		</label>
	{:else}
		<label>
			* Měsíc
			<input
				type="month"
				value={month_year}
				on:input={(e) => {
					const m = e.target.value;
					const from = new Date(`${m}-01`);
					const to = new Date(from);
					to.setMonth(to.getMonth() + 1);

					updateParams({
						date_from: formatDate(from),
						date_to: formatDate(to)
					});
				}}
			/>
		</label>
	{/if}
	<br />
	<StyledSelect
		label="Prostor"
		value={id_venue}
		options={data.venues}
		on:change={(e) => updateParams({ id_venue: e.detail?.value?.id })}
	/>
	<StyledSelect
		label="Žánr/typ"
		value={id_genre}
		options={data.genres}
		on:change={(e) => updateParams({ id_genre: e.detail?.value?.id })}
	/>
	<button on:click={() => (showTable = !showTable)}>{showTable ? 'Kalendář' : 'Tabulka'}</button>
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
