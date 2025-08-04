<script>
	import { User } from '$lib/classes/user.js';
	import { onMount } from 'svelte';

	export let data;
	const user = User.fromJSON(data.user);

	const martinLoggedIn = parseInt(user.id) === 2;
	onMount(() => {
		if (martinLoggedIn) {
			document.body.style.backgroundColor = '#fea9dd';
			document.body.style.backgroundImage = "url('/background.jpg')";
			document.body.style.backgroundAttachment = 'fixed';
			document.body.style.backgroundPosition = 'center';
			document.body.style.backgroundSize = 'contain';
		}
	});
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
