<script>
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<p>
	{@html user.getInfoString()}
	<a href="/logout">Odhlásit se</a>
	<br />
	(práva: {#each user.privileges as privilege}
		{privilege.id}: <b>{privilege.label}</b>
		{#if privilege.structureLabel}(<i>{privilege.structureLabel}</i>){/if},&nbsp;
	{/each})
</p>

<slot />