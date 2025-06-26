<script>
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<p>
	{@html user.getInfoString()}
	<a href="/logout">logout</a>
	<br />
	(privileges: {#each user.privileges as privilege}
		{privilege.id}: <b>{privilege.label}</b>
		{#if privilege.structureLabel}(<i>{privilege.structureLabel}</i>){/if},&nbsp;
	{/each})
</p>

<slot />