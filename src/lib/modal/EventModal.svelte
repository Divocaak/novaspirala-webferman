<script>
	import Pill from '$lib/Pill.svelte';
	import EventBookButton from '$lib/buttons/EventBookButton.svelte';
	import EventDeleteButton from '$lib/buttons/EventDeleteButton.svelte';
	import EventEditButton from '$lib/buttons/EventEditButton.svelte';
	import ExportToCalendarsButton from '$lib/buttons/ExportToCalendarsButton.svelte';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';
	import Modal from '$lib/modal/Modal.svelte';
	import Tooltip from '$lib/tooltip/Tooltip.svelte';
	import TooltipGenre from '$lib/tooltip/TooltipGenre.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';
	import TooltipVenue from '$lib/tooltip/TooltipVenue.svelte';

	export let selectedData = null;
	export let closeModalFunction;
	export let user;
	export let startOfDay;
	export let openBookingModalFunction;

	const pastEditable = selectedData.event.date_from_ts >= startOfDay;
	const pastBookable = pastEditable;
</script>

<Modal {closeModalFunction}>
	<h1>
		<Pill
			label={selectedData.event.label}
			txtClr={selectedData.event.txtClr}
			bgClr={selectedData.event.bgClr}
		/>
	</h1>
	<p>
		<TooltipVenue
			bgClr={selectedData.event.vBgClr}
			txtClr={selectedData.event.vTxtClr}
			label={selectedData.event.vLabel}
			addr_label={selectedData.event.addr_label}
			addr_street={selectedData.event.addr_street}
			addr_postal={selectedData.event.addr_postal}
			addr_town={selectedData.event.addr_town}
			addr_country_code={selectedData.event.addr_country_code}
		/>
		<TooltipGenre
			bgClr={selectedData.event.gBgClr}
			txtClr={selectedData.event.gTxtClr}
			label={selectedData.event.gLabel}
			note={selectedData.event.note}
		/>
	</p>
	{#if selectedData.event.id_order}
		<p>ID objednávky:&nbsp;<i>{selectedData.event.id_order}</i></p>
	{/if}
	<p>
		<LocalisedDateRange from={selectedData.event.date_from} to={selectedData.event.date_to} />
	</p>
	<p style="white-space: pre-line;">{selectedData.event.description}</p>
	<p>
		Vytvořil:
		<TooltipUser
			l_name={selectedData.event.l_name}
			f_name={selectedData.event.f_name}
			login={selectedData.event.login}
			email={selectedData.event.email}
			phone={selectedData.event.phone}
		/>
	</p>
	{#each selectedData.enrichedUsers as user}
		<p>
			<Tooltip>
				<Pill
					bgClr={user.role.bgClr}
					txtClr={user.role.txtClr}
					label="{user.role.label}&nbsp;(?)"
				/>
				<span slot="tooltip">{user.role.note}</span>
			</Tooltip>
			&rarr;
			<TooltipUser
				l_name={user.l_name}
				f_name={user.f_name}
				login={user.login}
				email={user.email}
				phone={user.phone}
			/>
		</p>
	{/each}
	<EventEditButton id={selectedData.event.id} {user} {pastEditable} />
	<EventDeleteButton id={selectedData.event.id} {user} {pastEditable} />
	<EventBookButton
		id={selectedData.event.id}
		{user}
		{pastBookable}
		openModalFunction={() => openBookingModalFunction(selectedData.event)}
	/>
	<ExportToCalendarsButton event={selectedData.event} />
</Modal>
