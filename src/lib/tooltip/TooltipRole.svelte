<script>
	import Pill from '$lib/Pill.svelte';
	import Tooltip from '$lib/tooltip/Tooltip.svelte';

	export let role;
	export let displayManagerText = false;
</script>

<Tooltip>
	<Pill
		bgClr={role.background_color}
		txtClr={role.text_color}
		label="{role.id}:&nbsp;<b>{role.label}{displayManagerText ? "&nbsp;(Vedoucí)" : ""}</b>&nbsp;(?)"
	/>
	<span slot="tooltip">
		{role.note}
	</span>
</Tooltip>
