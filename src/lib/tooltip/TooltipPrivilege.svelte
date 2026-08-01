<script>
	import Tooltip from '$lib/tooltip/Tooltip.svelte';

	export let id;
	export let label;
	export let note;
</script>

<Tooltip>
	{id}:&nbsp;<b>{label}</b>&nbsp;(?),
	<span slot="tooltip">
		{note}
	</span>
</Tooltip>
