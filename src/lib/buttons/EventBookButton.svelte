<script>
	import { User } from '$lib/classes/user';

	export let user;
	export let pastBookable;
	export let openModalFunction;

	const userObject = User.fromJSON(user);
</script>

{#if userObject.isAllowedToBook(pastBookable)}
	<button class="custom-btn" on:click={openModalFunction}>Booking směny</button>
{/if}
