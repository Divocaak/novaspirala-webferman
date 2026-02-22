<script>
	import StyledMultiSelect from '$lib/form/StyledMultiSelect.svelte';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';

	export let roles = [];
	export let value = {};
	export let user;

	export let eid;

	async function askForComment(rid) {
		const comment = prompt('Komentář');
		if (!comment) return;

		const res = await fetch('/api/comments/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_event: eid,
				id_role: rid,
				id_created_by: user.id,
				comment
			})
		});

		if (!res.ok) alert('Chyba při ukládání komentáře');
		await reloadComments();
	}

	async function deleteComment(cid) {
		if (!confirm('Opravdu?')) return;
		const res = await fetch(`/api/comments/delete?cid=${cid}`);
		if (!res.ok) alert('Chyba při ukládání komentáře');
		await reloadComments();
	}

	async function reloadComments() {
		const res = await fetch(`/api/comments/getAllInEvent?eid=${eid}`);
		if (!res.ok) return;

		const data = await res.json();

		roles = roles.map((role) => ({
			...role,
			comments: data[role.role.id] ?? []
		}));
	}

	console.log(user.isAllowedToComment());
</script>

{#each roles as role}
	<div class="section" style="background:{role.role.bgClr}; color:{role.role.txtClr};">
		{#if role.users.length < 1}
			<p>
				Počet uživatelů s rolí "<b>{role.role.label}</b>" je 0
			</p>
		{:else}
			<StyledMultiSelect
				label={role.role.label}
				options={role.users}
				bind:value={value[role.role.id]}
				readonly={!user.isRolesManager(role.role.id)}
			/>
		{/if}
		<p>{role.role.note}</p>
		{#if eid && user.isAllowedToComment()}
			<button type="button" on:click={() => askForComment(role.role.id)}>Přidat komentář</button>
		{/if}
		{#each role.comments as comment}
			<div class="comment">
				<p>{comment.created}</p>
				<TooltipUser
					l_name={comment.user.l_name}
					f_name={comment.user.f_name}
					login={comment.user.login}
					email={comment.user.email}
					phone={comment.user.phone}
				/>
				<p>{comment.comment}</p>
				{#if comment.user.id === user.id}
					<button type="button" on:click={() => deleteComment(comment.id)}> Odstranit </button>
				{/if}
			</div>
		{/each}
	</div>
{/each}

<style>
	.section {
		margin-bottom: 3rem;
		border: 1px solid lightgrey;
	}

	.comment {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.comment button {
		height: 100%;
	}
</style>
