<script>
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

		// When "to" is time-only, keep its time but
		// update the date to match "from".
		if (toOnlyTime) {
			const time = range.to.split('T')[1];
			updateRange({ from: value, to: time ? `${value.split('T')[0]}T${time}` : value });
			return;
		}

		updateRange({ from: value });
	}

	function updateTo(value) {
		if (toOnlyTime) {
			const date = range.from?.split('T')[0];
			updateRange({ to: date ? `${date}T${value}` : value });
			return;
		}

		updateRange({ to: value });
	}

	function getTime(value) {
		if (!value) return '';
		return value.split('T')[1] || '';
	}
</script>

<label>
	* Od
	<input
		type="datetime-local"
		value={range.from}
		required
		{readonly}
		on:input={(e) => updateFrom(e.currentTarget.value)}
	/>
</label>

<label>
	* Do
	<input
		type={toOnlyTime ? 'time' : 'datetime-local'}
		value={toOnlyTime ? getTime(range.to) : range.to}
		required
		{readonly}
		on:input={(e) => updateTo(e.currentTarget.value)}
	/>
</label>
