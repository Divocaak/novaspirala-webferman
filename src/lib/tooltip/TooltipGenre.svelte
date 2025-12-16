<script>
	import Tooltip from '$lib/tooltip/Tooltip.svelte';
	import Pill from '$lib/Pill.svelte';

    export let bgClr;
    export let txtClr;
    export let label;
    export let note;
</script>

<Tooltip>
	<Pill {bgClr} {txtClr} {label} />
	<span slot="tooltip">{note}</span>
</Tooltip>
