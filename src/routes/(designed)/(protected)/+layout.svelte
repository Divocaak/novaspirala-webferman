<script>
	import { User } from '$lib/classes/user.js';
	import TooltipPrivilege from '$lib/tooltip/TooltipPrivilege.svelte';
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
			document.body.style.backgroundSize = 'cover';
		}
	});

	async function sendFeedback() {
		const feedback = prompt('Mám prosbu, stížnost, hlásím chybu, něco mi nefunguje apod.');
		if (!feedback) return;
		const res = await fetch('/api/feedback/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_created_by: user.id,
				feedback
			})
		});

		if (!res.ok) {
			alert('Chyba při ukládání zpětné vazby');
			return;
		}

		alert("Uloženo!");
	}
</script>

<p>
	{@html user.getInfoString()}
	<a href="/logout">Odhlásit se</a>
	<br />
	(práva: {#each user.privileges as privilege}
		<TooltipPrivilege {privilege} />
	{/each})<br />
	(role: {#each user.roles as role}
		{role.id}: <b>{role.label}</b>{#if role.manager}
			(<i>Vedoucí</i>){/if},&nbsp;
	{/each}
	)
</p>
<button onclick={sendFeedback}>Zpětná vazba</button><br/>

<slot />

<style>
	button {
		background: none !important;
		border: none;
		padding: 0 !important;
		color: #807fe2;
		cursor: pointer;
	}

	button:hover {
		text-decoration: underline;
	}
</style>
