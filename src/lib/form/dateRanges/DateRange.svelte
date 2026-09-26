<script>
	import SveltyPicker from 'svelty-picker';
	import { createEventDispatcher } from 'svelte';

	export let range = {
		uid: crypto.randomUUID(),
		from: '',
		to: ''
	};

	export let readonly = false;
	export let toOnlyTime = false;

	const dispatch = createEventDispatcher();

	function updateRange(changes) {
		range = { ...range, ...changes };
		dispatch('change', range);
	}

	function updateFrom(value) {
		// If "to" hasn't been filled yet, initialize it
		// with the same datetime as "from".
		if (!range.to) {
			updateRange({ from: value, to: value });
			return;
		}

		updateRange({ from: value });
	}

	function getTime(value) {
		if (!value) return '';
		return value.split('T')[1] || '';
	}
</script>

<label>
	* Od
	<SveltyPicker
		value={range.from}
		mode="datetime"
		format="yyyy-mm-dd hh:ii"
		manualInput={!readonly}
		disabled={readonly}
		required
		onInput={(e) => {
			updateFrom(e);
		}}
	/>
</label>

<label>
	* Do
	{#if toOnlyTime}
		<SveltyPicker
			value={range.to}
			mode="time"
			format="hh:ii"
			manualInput={!readonly}
			disabled={readonly}
			required
			onInput={(e) => {
				updateRange({ to: e });
			}}
		/>
	{:else}
		<SveltyPicker
			value={range.to}
			mode="datetime"
			format="yyyy-mm-dd hh:ii"
			manualInput={!readonly}
			disabled={readonly}
			required
			onInput={(e) => {
				updateRange({ to: e });
			}}
		/>
	{/if}
</label>
