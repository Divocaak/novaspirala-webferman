<script>
	import { onMount } from 'svelte';
	import SveltyPicker from 'svelty-picker';
	import MonthPicker from '$lib/form/MonthPicker.svelte';

	export let params;
	export let onChange = () => {};

	$: filterByDay = params.get('filterByDay') === 'true';
	$: date_from = params.get('date_from') ?? getCurrentMonthStart();
	$: date_to = params.get('date_to') ?? getCurrentMonthEnd();
	$: month_year = date_from.slice(0, 7);

	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getCurrentMonth() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	}

	function getCurrentMonthStart() {
		return `${getCurrentMonth()}-01`;
	}

	function getCurrentMonthEnd() {
		const now = new Date();
		const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return formatDate(end);
	}

	function getMonthRange(month) {
		const from = new Date(`${month}-01`);
		const to = new Date(from);
		to.setMonth(to.getMonth() + 1);
		return { date_from: formatDate(from), date_to: formatDate(to) };
	}

	function getDefaultDateRange() {
		const from = new Date();
		const to = new Date(from);
		to.setDate(to.getDate() + 30);
		return { date_from: formatDate(from), date_to: formatDate(to) };
	}

	function switchFilterMode() {
		if (filterByDay) {
			onChange({ filterByDay: 'false', ...getMonthRange(month_year) });
			return;
		}
		const range = getMonthRange(month_year);
		onChange({ filterByDay: 'true', date_from: range.date_from, date_to: range.date_from });
	}

	onMount(() => {
		const updates = {};
		if (!params.has('filterByDay')) updates.filterByDay = 'false';
		if (!params.has('date_from') || !params.has('date_to'))
			Object.assign(updates, getDefaultDateRange());
		if (Object.keys(updates).length > 0) onChange(updates);
	});
</script>

<button on:click={switchFilterMode}>
	Přepnout na filtrování po {filterByDay ? 'měsících' : 'dnech'}
</button>

<br />

{#if filterByDay}
	<label>
		* Od
		<SveltyPicker
			value={date_from}
			mode="date"
			format="yyyy-mm-dd"
			onChange={(date) => onChange({ filterByDay: 'true', date_from: date, date_to: date })}
		/>
	</label>

	<label>
		* Do
		<SveltyPicker
			value={date_to}
			mode="date"
			format="yyyy-mm-dd"
			onChange={(date) => onChange({ filterByDay: 'true', date_to: date })}
		/>
	</label>
{:else}
	<label>
		* Měsíc
		<MonthPicker
			value={month_year}
			onChange={(month) => onChange({ filterByDay: 'false', ...getMonthRange(month) })}
		/>
	</label>
{/if}
