<script>
	import { createEventDispatcher } from 'svelte';
	import DateRange from './DateRange.svelte';

	export let ranges = [];
	export let readonly = false;

	const dispatch = createEventDispatcher();

	function updateRange(index, range) {
		ranges = ranges.map((r, i) => (i === index ? range : r));
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
</script>

{#each ranges as range, index (range.uid)}
	<div>
		<DateRange
			{range}
			{readonly}
			toOnlyTime={true}
			on:change={(e) => updateRange(index, e.detail)}
		/>

		{#if ranges.length > 1}
			<button type="button" on:click={() => removeRange(range.uid)}> Odstranit termín </button>
		{/if}
	</div>
{/each}

<button type="button" on:click={addRange}> Přidat další termín </button>
