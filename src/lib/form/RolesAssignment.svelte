<script>
	import StyledMultiSelect from '$lib/form/StyledMultiSelect.svelte';

	export let roles = [];
	export let value = {};
	export let createdById;
	export let user;
</script>

{#each roles as role}
	<div style="background:{role.role.bgClr}; color:{role.role.txtClr}">
		{#if role.users.length < 1}
			<p>
				Počet uživatelů s rolí "<b>{role.role.label}</b>" je 0
			</p>
		{:else}
			<StyledMultiSelect
				label={role.role.label}
				options={role.users}
				bind:value={value[role.role.id]}
				readonly={!user.isRolesManager(createdById, role.role.id)}
			/>
		{/if}
		<p>{role.role.note}</p>
	</div>
{/each}
