<script>
	export let label;
	export let txtClr;
	export let bgClr;
</script>

<span style="--bgClr: {bgClr}; --txtClr: {txtClr};">{label}</span>

<style>
	span {
		background-color: var(--bgClr);
		color: var(--txtClr);
		border-radius: 0.5rem;
		padding: 0.2rem 0.4rem;
		margin: 0.1rem;

		white-space: nowrap;
	}
</style>
