<script>
	import Pill from './Pill.svelte';
	export let event;
	export let roles;

	const enrichedUsers = event.users.map((user) => ({
		...user,
		role: roles.get(user.id_role)
	}));

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('select', {event, enrichedUsers});
	}
</script>

<button
	style="--rows: {event.daySpan}; --bgClr: {event.bgClr}; --txtClr: {event.txtClr};"
	on:click={handleClick}
>
	{event.label}
	<Pill label={event.gLabel} bgClr={event.gBgClr} txtClr={event.gTxtClr} />
	<div class="users-wrapper">
		{#each enrichedUsers as user}
			<Pill label="{user.l_name} {user.f_name}" bgClr={user.role.bgClr} txtClr={user.role.txtClr} />
		{/each}
	</div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="currentColor"
		class="bi bi-info-circle-fill"
		viewBox="0 0 16 16"
	>
		<path
			d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"
		/>
	</svg>
</button>

<style>
	button {
		all: unset;

		display: flex;
		grid-column: span 1;

		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		grid-row: span var(--rows);
		background-color: var(--bgClr);
		color: var(--txtClr);

		position: relative;

		transition: all 0.35s ease-in-out;

		cursor: pointer;
	}

	button svg {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0.3rem;
	}

	.users-wrapper {
		position: relative;
		padding: 0.5rem;
	}

	button:hover {
		background-color: #36454f;
	}
</style>
