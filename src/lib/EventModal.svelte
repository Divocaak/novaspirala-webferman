<script>
	import { getLocalisedDate } from '$lib/dateParser';
	import Pill from '$lib/Pill.svelte';
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
			<span class="tooltip">
				<Pill
					label="{selectedData.event.vLabel}&nbsp;(?)"
					txtClr={selectedData.event.vTxtClr}
					bgClr={selectedData.event.vBgClr}
				/>
				<span class="tooltip-text">
					{selectedData.event.addr_label}, {selectedData.event.addr_street},<br />
					{selectedData.event.addr_postal}&nbsp;{selectedData.event.addr_town}, {selectedData.event
						.addr_country_code}
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
		<!-- TODO edit and delete btns -->
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
