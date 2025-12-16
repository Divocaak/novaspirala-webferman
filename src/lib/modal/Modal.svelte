<script>
	export let closeModalFunction;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="modal-backdrop" on:click={closeModalFunction} role="button" tabindex="0">
	<div class="modal" on:click|stopPropagation role="button" tabindex="0">
		<slot></slot>
	</div>
</div>

<style>
	.modal-backdrop {
		box-sizing: border-box;
		position: fixed;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background: rgba(0, 0, 0, 0.6);

		width: 100%;
		height: 100%;

		z-index: 9999;

		overflow: hidden;
	}

	.modal {
		display: block !important;
		overflow: auto !important;
		opacity: 1 !important;

		background: #f0f0f0;
		padding: 1.5rem;
		border-radius: 8px;

		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		z-index: 10000;

		position: relative;
		box-sizing: border-box;
		max-width: 90vw;
		max-height: 90vh;
	}

	@media (max-width: 600px) {
		.modal {
			padding: 1rem;
			max-width: 95vw;
			max-height: 90vh;
		}
	}
</style>
