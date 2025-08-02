<script>
	import Tooltip from '$lib/Tooltip.svelte';
	import Pill from './Pill.svelte';

    export let bgClr;
    export let txtClr;
    export let label;
    export let note;
</script>

<Tooltip>
	<Pill {bgClr} {txtClr} {label} />
	<span slot="tooltip">{note}</span>
</Tooltip>
