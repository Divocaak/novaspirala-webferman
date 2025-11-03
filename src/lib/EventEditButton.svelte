<script>
	import { User } from './classes/user';

	export let id;
	export let user;
	export let pastEditable;

	const userObject = User.fromJSON(user);
</script>

{#if userObject.isAllowedToEdit(event.createdById, pastEditable)}
	<a href="/form?id={id}">Upravit</a>
{/if}
