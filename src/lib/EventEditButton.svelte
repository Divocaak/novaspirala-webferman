<script>
	import { User } from "./classes/user";

	export let id;
    export let user;
	const userObject = User.fromJSON(user);
</script>

{#if userObject.isAllowedToEdit(event.createdById)}
	<a href="/form?id={id}">Upravit</a>
{/if}
