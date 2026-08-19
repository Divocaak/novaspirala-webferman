<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { User } from '$lib/classes/user.js';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText.js';
	import Pill from '$lib/Pill.svelte';
	import Tooltip from '$lib/tooltip/Tooltip.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';
	import TooltipVenue from '$lib/tooltip/TooltipVenue.svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const formatDate = (date) => date.toISOString().split('T')[0];
	let date_from, date_to, month_year;

	$: params = $page.url.searchParams;
	$: {
		const today = new Date();
		const nextMonth = new Date();
		nextMonth.setMonth(today.getMonth() + 1);

		date_from = params.get('date_from') ?? formatDate(today);
		date_to = params.get('date_to') ?? formatDate(nextMonth);
		month_year = date_from.slice(0, 7);
	}

	function updateParams(updates) {
		const next = new URLSearchParams(params);

		for (const [key, value] of Object.entries(updates)) {
			if (!value) next.delete(key);
			else next.set(key, value);
		}

		goto(`/booking?${next.toString()}`);
	}

	$: sortedEvents = [...data.events].sort((a, b) => new Date(a.date_from) - new Date(b.date_from));

	function getBookings(eventId, roleId) {
		return data.bookings
			.filter((booking) => booking.id_event === eventId && booking.id_role === roleId)
			.sort((a, b) => new Date(a.booked) - new Date(b.booked));
	}

	function isSelected(booking) {
		return booking.active == 1;
	}

	function toggleBooking(booking) {
		booking.active = booking.active ? 0 : 1;
		data.bookings = [...data.bookings];
	}

	function updateBookingNote(booking, comment) {
		booking.comment = comment;
		data.bookings = [...data.bookings];
	}

	function selectAll(eventId, roleId) {
		for (const booking of getBookings(eventId, roleId)) {
			booking.active = 1;
		}

		data.bookings = [...data.bookings];
	}

	function resetAll(eventId, roleId) {
		for (const booking of getBookings(eventId, roleId)) {
			booking.active = 0;
		}

		data.bookings = [...data.bookings];
	}

	let saving = false;
	let saveMessage = '';
	async function saveBookings() {
		if (saving) return;
		saving = true;
		saveMessage = '';
		try {
			const res = await fetch('/api/bookingPage/saveAll', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					data.bookings.map((booking) => ({
						id_event: booking.id_event,
						id_role: booking.id_role,
						id_user: booking.id_user,
						active: booking.active ? 1 : 0,
						comment: booking.comment ?? ''
					}))
				)
			});

			if (!res.ok) throw new Error('Nepodařilo se uložit booking.');
			saveMessage = 'Uloženo';
		} catch (error) {
			console.error(error);
			saveMessage = 'Chyba při ukládání';
		} finally {
			saving = false;
		}
	}
</script>

<a href="/">zpět</a><br />
<h2>Booking</h2>

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
			updateParams({ date_from: formatDate(from), date_to: formatDate(to) });
		}}
	/>
</label>

<table>
	<thead>
		<tr>
			<th scope="col">ID Objednávky</th>
			<th scope="col">Název</th>
			<th scope="col">Datum</th>
			<th scope="col">Popis</th>
			<th scope="col">Prostor</th>
			{#each data.userRoles as role}
				<th scope="col">
					<Pill bgClr={role.background_color} txtClr={role.text_color} label={role.label}></Pill>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each sortedEvents as event}
			<tr>
				<td>
					{event.id_order}
				</td>
				<td style="background-color: {event.bgClr}">
					<b style="color: {event.txtClr}">{event.label}</b>
				</td>
				<td class="cell-max">
					<LocalisedDateRange from={event.date_from} to={event.date_to} wrap={true} />
				</td>
				<td class="desc-cell">
					<div class="desc">
						{event.description}
					</div>
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

				{#each data.userRoles as role}
					{@const bookings = getBookings(event.id, role.id)}

					<td class="cell-max">
						{#if bookings.length > 0}
							<div class="booking-actions">
								<button type="button" on:click={() => selectAll(event.id, role.id)}>
									Vybrat vše
								</button>
								<button
									type="button"
									on:click={() => resetAll(event.id, role.id)}
									disabled={!bookings.some((booking) => booking.active == 1)}
								>
									Zrušit výběr
								</button>
							</div>

							<div class="booking-users">
								{#each getBookings(event.id, role.id) as booking (`${booking.id_user}-${booking.id_role}-${booking.id_event}`)}
									<label class="booking-user" class:selected={isSelected(booking)}>
										<input
											type="checkbox"
											checked={isSelected(booking)}
											on:change={() => toggleBooking(booking)}
										/>
										<p>{booking.l_name} {booking.f_name}<br />{getLocalisedDate(booking.booked)}</p>

										<input
											type="text"
											placeholder="Poznámka..."
											value={booking.comment ?? ''}
											on:input={(e) => updateBookingNote(booking, e.target.value)}
										/>
									</label>
								{/each}
							</div>
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<button type="button" on:click={saveBookings} disabled={saving}>
	{saving ? 'Ukládám...' : 'Uložit'}
</button>
{#if saveMessage}<span>{saveMessage}</span>{/if}

<style>
	table {
		table-layout: fixed;
		width: 100%;
		/* width: fit-content; */
	}

	.cell-max {
		text-wrap: nowrap;
	}

	.booking-users {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.booking-user {
		display: flex;
		align-items: center;
		padding: 3px 0;
		cursor: pointer;
	}

	.booking-user input[type='checkbox'] {
		margin: 0 8px 0 0;
		flex-shrink: 0;
	}

	.booking-user p {
		margin: 0;
		line-height: 1.2;
	}

	.booking-user input[type='text'] {
		flex: 1;
		margin: 0 0 0 8px;
	}

	.booking-user.selected {
		background-color: #def;
		color: #013;
	}
</style>
