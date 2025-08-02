<script>
	export let bgClr = 'black';
	export let txtClr = 'white';
	export let className = '';
	export let style = '';
</script>

<div class="tooltip-container {className}" {style}>
	<slot />
	<span class="tooltip-text" style="background-color: {bgClr}; color: {txtClr}">
		<slot name="tooltip" />
	</span>
</div>

<style>
	.tooltip-container {
		position: relative;
		display: inline-block;
		cursor: help;
	}

	.tooltip-text {
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

	.tooltip-container:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
		font-weight: normal;
	}
</style>
