<script>
	import { User } from '$lib/classes/user';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<h2>home</h2>
<br>
{#if user.isSysAdmin()}<a href="/sysadmin">sysadmin</a><br />{/if}
{#if user.isAllowedToCreate()}<a href="/events">eventy</a><br />{/if}
{#if user.isAllowedToRead()}
kalendárium
{/if}
