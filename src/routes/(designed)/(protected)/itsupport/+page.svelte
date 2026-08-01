<script>
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<a href="/">zpět</a><br />
<h2>IT podpora</h2>

{#if user.isAllowedToITSupport()}<a href="/form">Přidat požadavek</a><br />{/if}