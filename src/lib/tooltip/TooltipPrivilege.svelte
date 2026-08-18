<script>
	import Pill from '$lib/Pill.svelte';
	import Tooltip from '$lib/tooltip/Tooltip.svelte';

	export let privilege;
</script>

<Tooltip>
	<Pill
		bgClr={privilege.background_color}
		txtClr={privilege.text_color}
		label="{privilege.id}:&nbsp;<b>{privilege.label}</b>&nbsp;(?)"
	/>
	<span slot="tooltip">
		{privilege.note}
	</span>
</Tooltip>
