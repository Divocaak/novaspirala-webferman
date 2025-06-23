<script>
	// @ts-nocheck
	import { User } from '$lib/classes/user';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<h2>home</h2>
<a href="/">back to public</a><br />
<br />
<a href="/scanner">qr scanner</a><br />
<br>
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br />{/if}
{#if user.isStructureAdmin()}<a href="/structure-admin">structure admin</a><br />{/if}
{#if user.isBartender()}<a href="/bartender">bartender</a><br />{/if}
