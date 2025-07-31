<script>
	import Pill from './Pill.svelte';
	import Tooltip from './Tooltip.svelte';

	export let bgClr;
	export let txtClr;
	export let label;
	export let addr_label;
	export let addr_street;
	export let addr_postal;
	export let addr_town;
	export let addr_country_code;
</script>

<Tooltip>
	<Pill {bgClr} {txtClr} {label} />
	<span slot="tooltip">
		{addr_label}, {addr_street},<br />{addr_postal}&nbsp;{addr_town}, {addr_country_code}
	</span>
</Tooltip>
