<script>
	export let value = '';
	export let onChange = () => {};

	const months = [
		'Leden',
		'Únor',
		'Březen',
		'Duben',
		'Květen',
		'Červen',
		'Červenec',
		'Srpen',
		'Září',
		'Říjen',
		'Listopad',
		'Prosinec'
	];

	$: currentYear = new Date().getFullYear();
	$: selectedYear = value ? value.substring(0, 4) : String(currentYear);
	$: selectedMonth = value ? value.substring(5, 7) : '';

	$: years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

	function updateValue(year, month) {
		if (month) {
			onChange(`${year}-${month}`);
		} else {
			onChange('');
		}
	}
</script>

<div class="month-picker">
	<select
		value={selectedMonth}
		on:change={(event) => updateValue(selectedYear, event.target.value)}
	>
		<option value="">Měsíc</option>
		{#each months as month, index}
			<option value={String(index + 1).padStart(2, '0')}>
				{month}
			</option>
		{/each}
	</select>

	<select
		value={selectedYear}
		on:change={(event) => updateValue(event.target.value, selectedMonth)}
	>
		{#each years as year}
			<option value={String(year)}>{year}</option>
		{/each}
	</select>
</div>

<style>
	.month-picker {
		display: flex;
		gap: 0.5rem;
	}

	.month-picker select{
		padding: 5px 10px;
	}
</style>
