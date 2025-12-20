<script>
	export let ranges = [];
	export let readonly = false;
	export let single = false;

	function addRange() {
		ranges = [...ranges, { uid: crypto.randomUUID(), from: '', to: '' }];
	}

	function removeRange(uid) {
		ranges = ranges.filter((r) => r.uid !== uid);
	}
</script>

{#if !single}
	{#each ranges as range (range.uid)}
		<div>
			<label>
				* Od
				<input type="datetime-local" bind:value={range.from} required {readonly} />
			</label>

			<label>
				* Do
				<input type="datetime-local" bind:value={range.to} required {readonly} />
			</label>

			{#if ranges.length > 1}
				<button type="button" on:click={() => removeRange(range.uid)}> Odstranit termín </button>
			{/if}
		</div>
	{/each}

	<button type="button" on:click={addRange}> Přidat další termín </button>
{:else}
	<label>
		* Od
		<input type="datetime-local" bind:value={ranges[0].from} required {readonly} />
	</label>

	<label>
		* Do
		<input type="datetime-local" bind:value={ranges[0].to} required {readonly} />
	</label>
{/if}
