<script>
	import Tooltip from '$lib/tooltip/Tooltip.svelte';

	export let l_name;
	export let f_name;
	export let login;
	export let email;
	export let phone;
</script>

<Tooltip>
	{l_name}&nbsp;{f_name}&nbsp;(?)
	<span slot="tooltip">
		{login},<br />
		<a href="mailto:{email}">{email}</a>,<br />
		<a href="tel:{phone}">{phone}</a>
	</span>
</Tooltip>
