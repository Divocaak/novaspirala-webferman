<script>
	import Pill from '$lib/Pill.svelte';
	import EventDeleteButton from './EventDeleteButton.svelte';
	import ExportToCalendarsButton from './ExportToCalendarsButton.svelte';
	import LocalisedDateRange from './LocalisedDateRange.svelte';
	import Tooltip from './Tooltip.svelte';
	import TooltipGenre from './TooltipGenre.svelte';
	import TooltipUser from './TooltipUser.svelte';
	import TooltipVenue from './TooltipVenue.svelte';

	export let selectedData = null;
	export let closeModal;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="modal-backdrop" on:click={closeModal} role="button" tabindex="0">
	<div class="modal" on:click|stopPropagation role="button" tabindex="0">
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
		<p>{selectedData.event.description}</p>
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
		<a href="/events/form?id={selectedData.event.id}">Upravit</a>
		<EventDeleteButton id={selectedData.event.id} />
		<ExportToCalendarsButton event={selectedData.event} />
	</div>
</div>

<style>
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
</style>
