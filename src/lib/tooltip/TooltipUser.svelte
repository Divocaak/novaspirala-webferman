<script>
	import { User } from '$lib/classes/user';
	import Tooltip from '$lib/tooltip/Tooltip.svelte';

	export let l_name;
	export let f_name;
	export let email;
	export let phone;

	export let user;
	const userObject = User.fromJSON(user);
</script>

{#if userObject.isAllowedToSeeTelNumbers() || userObject.isAllowedToSeeEmails()}
	<Tooltip>
		{l_name}&nbsp;{f_name}&nbsp;(?)
		<span slot="tooltip">
			{#if userObject.isAllowedToSeeEmails()}<a href="mailto:{email}">{email}</a>,<br />{/if}
			{#if userObject.isAllowedToSeeTelNumbers()}<a href="tel:{phone}">{phone}</a>{/if}
		</span>
	</Tooltip>
{:else}
	{l_name}&nbsp;{f_name}
{/if}
