<script>
	import { createEventDispatcher } from 'svelte';

	export let ranges = [];
	export let readonly = false;
	export let single = false;

	const dispatch = createEventDispatcher();

	function updateRange(uid, changes) {
		ranges = ranges.map((range) => (range.uid === uid ? { ...range, ...changes } : range));
		dispatch('ranges', ranges);
	}

	function addRange() {
		ranges = [
			...ranges,
			{
				uid: crypto.randomUUID(),
				from: '',
				to: ''
			}
		];
		dispatch('ranges', ranges);
	}

	function removeRange(uid) {
		ranges = ranges.filter((range) => range.uid !== uid);
		dispatch('ranges', ranges);
	}

	function updateFrom(uid, value) {
		const range = ranges.find((r) => r.uid === uid);
		if (!range) return;
		// Automatically set "Do" to "Od" if it hasn't been filled in yet.
		updateRange(uid, { from: value, ...(range.to ? {} : { to: value }) });
	}
</script>

{#if !single}
	{#each ranges as range (range.uid)}
		<div>
			<label>
				* Od
				<input
					type="datetime-local"
					value={range.from}
					required
					{readonly}
					on:input={(e) => updateFrom(range.uid, e.currentTarget.value)}
				/>
			</label>

			<label>
				* Do
				<input
					type="datetime-local"
					value={range.to}
					required
					{readonly}
					on:input={(e) => updateRange(range.uid, { to: e.currentTarget.value })}
				/>
			</label>

			{#if ranges.length > 1}
				<button type="button" on:click={() => removeRange(range.uid)}> Odstranit termín </button>
			{/if}
		</div>
	{/each}

	<button type="button" on:click={addRange}> Přidat další termín </button>
{:else if ranges[0]}
	<label>
		* Od
		<input
			type="datetime-local"
			value={ranges[0].from}
			required
			{readonly}
			on:input={(e) => updateFrom(ranges[0].uid, e.currentTarget.value)}
		/>
	</label>

	<label>
		* Do
		<input
			type="datetime-local"
			value={ranges[0].to}
			required
			{readonly}
			on:input={(e) => updateRange(ranges[0].uid, { to: e.currentTarget.value })}
		/>
	</label>
{/if}
