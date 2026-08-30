<script>
	import StyledMultiSelect from '$lib/form/StyledMultiSelect.svelte';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';
	import TooltipUser from '$lib/tooltip/TooltipUser.svelte';

	export let roles = [];
	export let value = {};
	export let user;
	export let eid;
	export let vacations = [];
	export let dateRanges = [];

	/* ---------- comments ---------- */
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

		if (!res.ok) {
			alert('Chyba při ukládání komentáře');
			return;
		}

		await reloadComments();
	}

	async function deleteComment(cid) {
		if (!confirm('Opravdu?')) return;
		const res = await fetch(`/api/comments/delete?cid=${cid}`);
		if (!res.ok) {
			alert('Chyba při ukládání komentáře');
			return;
		}
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
				withNote={true}
				{vacations}
				{dateRanges}
			/>
		{/if}

		<!-- ---------- ROLE NOTE ---------- -->
		<p>Vedoucí sekce: {role.role.note}</p>

		<!-- ---------- USER NOTES PREVIEW ---------- -->
		{#if value[role.role.id]?.length}
			<div class="user-notes">
				{#each value[role.role.id] as u (u.id)}
					{#each Object.entries(u.dates ?? {}) as [date, dateData]}
						{#if dateData.selected && dateData.note}
							<div class="user-note">
								<b>{u.label} — {getLocalisedDate(date, false)}:</b>
								{dateData.note}
							</div>
						{/if}
					{/each}
				{/each}
			</div>
		{/if}

		<!-- ---------- COMMENTS ---------- -->
		{#if eid && user.isAllowedToComment()}
			<button type="button" on:click={() => askForComment(role.role.id)}> Přidat komentář </button>
		{/if}

		{#each role.comments as comment}
			<div class="comment">
				<p>{comment.created}</p>

				<TooltipUser
					l_name={comment.user.l_name}
					f_name={comment.user.f_name}
					email={comment.user.email}
					phone={comment.user.phone}
					{user}
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
