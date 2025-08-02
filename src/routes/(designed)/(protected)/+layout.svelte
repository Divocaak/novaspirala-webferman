<script>
	import { User } from '$lib/classes/user.js';
	import { onMount } from 'svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const bodyBgClr = parseInt(user.id) === 2 ? '#fea9dd' : 'white';
	onMount(() => {
		document.body.style.backgroundColor = bodyBgClr;
	});
</script>

<p style="--body-bg-clr: {bodyBgClr};">
	{@html user.getInfoString()}
	<a href="/logout">Odhlásit se</a>
	<br />
	(práva: {#each user.privileges as privilege}
		{privilege.id}: <b>{privilege.label}</b>
		{#if privilege.structureLabel}(<i>{privilege.structureLabel}</i>){/if},&nbsp;
	{/each})
</p>

<slot />
