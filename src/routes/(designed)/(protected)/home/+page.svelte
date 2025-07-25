<script>
	import { User } from '$lib/classes/user';
	import { getLocalisedDate } from '$lib/dateParser';
	import EventCell from '$lib/EventCell.svelte';
	import Pill from '$lib/Pill.svelte';

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

			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				const dayKey = d.toISOString().split('T')[0];
				if (!dateVenueMap.has(dayKey)) dateVenueMap.set(dayKey, new Map());
				const venueMap = dateVenueMap.get(dayKey);
				if (!venueMap.has(venue)) venueMap.set(venue, []);
				venueMap.get(venue).push(event);
			}
		}

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

		for (let i = 1; i < span; i++) {
			const d = new Date(start);
			d.setDate(d.getDate() + i);
			const skipKey = `${d.toISOString().slice(0, 10)}|${venueKey}`;
			skippedCells.add(skipKey);
		}
	}

	const rolesMap = new Map(data.roles.map((role) => [role.id, role]));

	let showModal = false;
	let selectedData = null;

	const openModal = (eventData) => {
		console.log(eventData);
		selectedData = eventData.detail;
		console.log(selectedData);
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

{#if showModal}
	<button class="modal-backdrop" on:click={closeModal}>
		<div class="modal">
			<h1>
				<Pill
					label={selectedData.event.label}
					txtClr={selectedData.event.txtClr}
					bgClr={selectedData.event.bgClr}
				/>
			</h1>
			<p>
				<span class="tooltip">
					<Pill
						label="{selectedData.event.vLabel}&nbsp;(?)"
						txtClr={selectedData.event.vTxtClr}
						bgClr={selectedData.event.vBgClr}
					/>
					<span class="tooltip-text">
						{selectedData.event.addr_label}, {selectedData.event.addr_street},<br />
						{selectedData.event.addr_postal}&nbsp;{selectedData.event.addr_town}, {selectedData
							.event.addr_country_code}
					</span>
				</span>
				<span class="tooltip">
					<Pill
						label="{selectedData.event.gLabel}&nbsp;(?)"
						txtClr={selectedData.event.gTxtClr}
						bgClr={selectedData.event.gBgClr}
					/>
					<span class="tooltip-text">{selectedData.event.note}</span>
				</span>
			</p>
			{#if selectedData.event.id_order}
				<p>ID objednávky:&nbsp;<i>{selectedData.event.id_order}</i></p>
			{/if}
			<p>
				{getLocalisedDate(selectedData.event.date_from)}&nbsp;-&nbsp;{getLocalisedDate(
					selectedData.event.date_to
				)}
			</p>
			<p>{selectedData.event.description}</p>
			<p>
				Vytvořil:&nbsp;<span class="tooltip">
					{selectedData.event.l_name}&nbsp;{selectedData.event.f_name}&nbsp;(?)
					<span class="tooltip-text">
						{selectedData.event.login},<br />
						<a href="mailto:{selectedData.event.email}">{selectedData.event.email}</a>,<br />
						<a href="tel:{selectedData.event.phone}">{selectedData.event.phone}</a>
					</span>
				</span>
			</p>
			{#each selectedData.enrichedUsers as user}
				<p>
					<span class="tooltip">
						<Pill label="{user.role.label} (?)" txtClr={user.role.txtClr} bgClr={user.role.bgClr} />
						<span class="tooltip-text">{user.role.note}</span>
					</span>
					&rarr;
					<span class="tooltip">
						{user.l_name}&nbsp;{user.f_name}&nbsp;(?)
						<span class="tooltip-text">
							{user.login},<br />
							<a href="mailto:{user.email}">{user.email}</a>,<br />
							<a href="tel:{user.phone}">{user.phone}</a>
						</span>
					</span>
				</p>
			{/each}
			<a on:click={alert("clck")}>tst</a>
		</div>
	</button>
{/if}

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
					<EventCell
						event={visibleEventMap.get(`${date}|${venue}`)}
						roles={rolesMap}
						on:select={(eventData) => openModal(eventData)}
					/>
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

	.modal-backdrop {
		all: unset;

		position: fixed;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background: rgba(0, 0, 0, 0.6);

		width: 100%;
		height: 100%;

		z-index: 9999;
	}

	.modal {
		display: unset !important;
		overflow: auto !important;
		opacity: 1 !important;

		position: relative;
		max-width: 90vw;
		max-height: 90vh;

		background: #f0f0f0;
		padding: 1.5rem;
		border-radius: 8px;

		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		z-index: 10000;
	}

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
</style>
