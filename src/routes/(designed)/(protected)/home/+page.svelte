<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { User } from '$lib/classes/user';
	import EventCalendar from '$lib/calendar/EventCalendar.svelte';
	import EventTable from '$lib/EventTable.svelte';
	import { findInSelect } from '$lib/form/findInSelect.js';
	import StyledSelect from '$lib/form/StyledSelect.svelte';
	import BookingModal from '$lib/modal/BookingModal.svelte';
	import NotificationsModal from '$lib/modal/NotificationsModal.svelte';
	import ExportAttendanceButton from '$lib/buttons/ExportAttendanceButton.svelte';
	import SveltyPicker from 'svelty-picker';
	import MonthPicker from '$lib/form/MonthPicker.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

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

	let showEmptyDays = true;
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

	let notificationsModalShown = false;
	const switchNotificationsModal = () => {
		notificationsModalShown = !notificationsModalShown;
	};
</script>

<h2>home</h2>
<br />
{#if data.notifications.length > 0}
	<button class="custom-btn" on:click={switchNotificationsModal}>
		✦ <b>{data.notifications.length}</b> nové notifikace
	</button><br />
{/if}
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br /><br />{/if}
{#if user.isSubtitlesRoleManager()}<a href="/subtitles/management">Spravovat titulky</a><br />{/if}
{#if user.isAllowedToITSupport()}<a href="/itsupport">IT podpora</a><br />{/if}
{#if user.isAllowedToWriteVacation()}<a href="/vacation">Dovolená</a><br />{/if}
{#if user.hasManagingRole || user.isSysAdmin()}<a href="/booking">Booking</a><br />{/if}
{#if user.hasManagingRole}<ExportAttendanceButton {user} />{/if}
{#if user.isAllowedToCreate()}<a href="/form"><br />Přidat event</a><br />{/if}
{#if user.isAllowedToRead()}
	<button on:click={() => setDayFilter(!filterByDay)}>
		Přepnout na filtrování po {filterByDay ? 'měsících' : 'dnech'}
	</button><br />
	{#if filterByDay}
		<label>
			* Od
			<SveltyPicker
				value={date_from}
				mode="date"
				format="yyyy-mm-dd"
				onChange={(e) => {
					updateParams({ date_from: e, date_to: e });
				}}
			/>
		</label>

		<label>
			* Do
			<SveltyPicker
				value={date_to}
				mode="date"
				format="yyyy-mm-dd"
				onChange={(e) => {
					updateParams({ date_to: e });
				}}
			/>
		</label>
	{:else}
		<label>
			* Měsíc
			<MonthPicker
				value={month_year}
				onChange={(m) => {
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
	<label>
		<input type="checkbox" bind:checked={showEmptyDays} />
		Zobrazit volné dny
	</label><br />
	<button on:click={() => (showTable = !showTable)}>{showTable ? 'Kalendář' : 'Tabulka'}</button>
	{#if !showTable}
		<EventCalendar
			events={data.events}
			roles={data.roles}
			vacations={data.vacations}
			{date_from}
			{date_to}
			{user}
			{startOfDay}
			{showEmptyDays}
			openBookingModalFunction={openBookingModal}
		/>
	{:else}
		<EventTable
			events={data.events}
			roles={data.roles}
			vacations={data.vacations}
			{user}
			{startOfDay}
			{date_from}
			{date_to}
			{showEmptyDays}
			openBookingModalFunction={openBookingModal}
		/>
	{/if}
	{#if showBookingModal}
		<BookingModal {selectedEvent} closeModalFunction={closeBookingModal} {user} />
	{/if}
	{#if notificationsModalShown}
		<NotificationsModal
			closeModalFunction={switchNotificationsModal}
			{user}
			notifications={data.notifications}
		/>
	{/if}
{/if}
