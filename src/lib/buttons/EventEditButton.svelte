<script>
	import { User } from '$lib/classes/user';

	export let id;
	export let user;

	const userObject = User.fromJSON(user);
</script>

{#if userObject.isAllowedToEdit()}
	<a href="/form?id={id}">Upravit</a>
{/if}
