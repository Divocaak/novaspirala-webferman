<script>
	// @ts-nocheck
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<h1>ki-app protected</h1>
<p>
	{@html user.getInfoString()}
	<a href="/logout">logout</a>
	<br />
	(privileges: {#each user.privileges as privilege}
		{privilege.id}: <b>{privilege.label}</b> {#if privilege.structureLabel}(<i>{privilege.structureLabel}</i>){/if},&nbsp;
	{/each})
</p>

<slot />

<style>
	:global(table) {
		border-collapse: collapse;
		margin-top: 20px;
	}

	:global(td) {
		border: 1.5px solid black;
		padding: 5px;
	}

	:global(tr:nth-child(even)) {
		background-color: #b7b7b7;
	}
</style>
