<script>
	import Badge from '$lib/Badge.svelte';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';
	import { createEventDispatcher } from 'svelte';

	export let id = '';
	export let label = '';
	export let required = false;
	export let readonly = false;
	export let options = [];
	export let value = [];
	export let withNote = false;
	export let vacations = [];
	export let dateRanges = [];

	const dispatch = createEventDispatcher();

	/* ---------- dates ---------- */
	$: dates = getEventDates(dateRanges);
	$: multipleDays = dates.length > 1;
	function getEventDates(ranges) {
		if (!ranges?.length) return [];

		const dates = new Set();

		for (const range of ranges) {
			if (!range.from || !range.to) continue;

			const from = String(range.from).slice(0, 10);
			const to = String(range.to).slice(0, 10);

			const current = new Date(`${from}T12:00:00`);
			const end = new Date(`${to}T12:00:00`);

			while (current <= end) {
				dates.add(
					[
						current.getFullYear(),
						String(current.getMonth() + 1).padStart(2, '0'),
						String(current.getDate()).padStart(2, '0')
					].join('-')
				);

				current.setDate(current.getDate() + 1);
			}
		}

		return [...dates].sort();
	}

	/* ---------- value helpers ---------- */
	function getUserValue(userId) {
		return value.find((user) => user.id === userId);
	}

	function getDateValue(userId, date) {
		return (
			getUserValue(userId)?.dates?.[date] ?? {
				selected: false,
				note: ''
			}
		);
	}

	function isSelected(userId, date) {
		return getDateValue(userId, date).selected;
	}

	function getNote(userId, date) {
		return getDateValue(userId, date).note ?? '';
	}

	/* ---------- selection ---------- */

	function toggleOption(option, date) {
		if (readonly) return;

		const userIndex = value.findIndex((user) => user.id === option.id);

		const userValue =
			userIndex === -1
				? { ...option, dates: {} }
				: { ...value[userIndex], dates: { ...(value[userIndex].dates ?? {}) } };

		const current = getDateValue(option.id, date);

		userValue.dates[date] = { ...current, selected: !current.selected };

		if (userIndex === -1) value = [...value, userValue];
		else {
			value = [...value];
			value[userIndex] = userValue;
		}

		dispatchChange();
	}

	function updateNote(option, date, note) {
		const userIndex = value.findIndex((user) => user.id === option.id);

		if (userIndex === -1) return;

		value = [...value];

		value[userIndex] = {
			...value[userIndex],
			dates: {
				...(value[userIndex].dates ?? {}),
				[date]: { ...getDateValue(option.id, date), note }
			}
		};

		dispatchChange();
	}

	function dispatchChange() {
		dispatch('input', value);
		dispatch('change', { value });
	}

	/* ---------- select / reset ---------- */
	function selectAll() {
		if (readonly || !dates.length) return;

		value = options.map((option) => ({
			...option,
			dates: Object.fromEntries(
				dates.map((date) => [date, { ...getDateValue(option.id, date), selected: true }])
			)
		}));

		dispatchChange();
	}

	function resetAll() {
		if (readonly) return;

		value = value.map((user) => ({
			...user,
			dates: Object.fromEntries(
				dates.map((date) => [date, { ...getDateValue(user.id, date), selected: false }])
			)
		}));

		dispatchChange();
	}

	$: hasSelectedUsers = value.some((user) =>
		dates.some((date) => getDateValue(user.id, date).selected)
	);

	/* ---------- vacations ---------- */
	$: vacationMap = buildVacationMap(options, vacations, dateRanges);

	function buildVacationMap(options, vacations, dateRanges) {
		return new Map(
			options.map((option) => [option.id, getUserVacations(option.id, vacations, dateRanges)])
		);
	}

	function getUserVacations(userId, vacations, dateRanges) {
		if (!vacations?.length || !dateRanges?.length) return [];

		return vacations.filter((vacation) => {
			if (vacation.id_user !== userId) return false;

			const vacationStart = new Date(vacation.date_from);
			const vacationEnd = new Date(vacation.date_to);

			return dateRanges.some((range) => {
				if (!range.from || !range.to) return false;
				const eventStart = new Date(range.from);
				const eventEnd = new Date(range.to);
				return eventStart <= vacationEnd && eventEnd >= vacationStart;
			});
		});
	}

	function syncDisabled(node, disabled) {
		node.disabled = disabled;

		return {
			update(disabled) {
				node.disabled = disabled;
			}
		};
	}
</script>

<b>
	{#if required}*{/if}{label}
</b>

{#if !readonly && dates.length > 0}
	<div class="actions">
		<button type="button" on:click={selectAll}> Vybrat vše </button>
		<button type="button" on:click={resetAll} disabled={!hasSelectedUsers}>Zrušit výběr</button>
	</div>
{/if}

<div class:multi-day={multipleDays} class="multi-select-checkbox" role="table">
	{#if multipleDays}
		<div
			class="header-row"
			role="row"
			style={`grid-template-columns: minmax(180px, 1fr) repeat(${dates.length}, minmax(180px, 1fr));`}
		>
			<div class="user-column">Uživatel</div>
			{#each dates as date}
				<div class="date-column">{getLocalisedDate(date, false)}</div>
			{/each}
		</div>
	{/if}

	{#each options as option (option.id)}
		{@const userVacations = vacationMap.get(option.id) ?? []}

		<div
			class="user-row"
			role="row"
			class:on-vacation={userVacations.length > 0}
			style={`grid-template-columns: minmax(180px, 1fr) repeat(${dates.length}, minmax(180px, 1fr));`}
		>
			<div class="user-column user-info">
				<span class="user-name">{option.label}</span>

				<div class="badges">
					{#if option.booked}
						<Badge content={`REZERVOVÁNO<br/>${getLocalisedDate(option.booked)}`} type="booking" />
					{/if}

					{#each userVacations as vacation (vacation.id)}
						<Badge
							content="DOVOLENÁ<br/>od: {getLocalisedDate(
								vacation.date_from,
								false
							)}<br/>do: {getLocalisedDate(vacation.date_to, false)}"
							type="vacation"
						/>
					{/each}
				</div>
			</div>

			{#each dates as date}
				<div class:single-day-cell={!multipleDays} class="date-cell">
					<label>
						{#key value}
							<input
								type="checkbox"
								checked={isSelected(option.id, date)}
								on:change={() => toggleOption(option, date)}
								disabled={readonly}
							/>
						{/key}

						{#if withNote}
							<input
								type="text"
								placeholder="Poznámka"
								value={getNote(option.id, date)}
								on:input={(e) => updateNote(option, date, e.currentTarget.value)}
								use:syncDisabled={readonly || !isSelected(option.id, date)}
							/>
						{/if}
					</label>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.multi-select-checkbox {
		border: 1px solid #ccc;
		padding: 5px;
		max-height: 400px;
		overflow: auto;
		width: 100%;
	}

	.header-row,
	.user-row {
		display: grid;
		min-width: max-content;
	}

	.header-row {
		font-weight: bold;
		border-bottom: 1px solid #ccc;
	}

	.user-row {
		border-bottom: 1px solid #eee;
	}

	.user-column {
		padding: 8px;
		position: sticky;
		left: 0;
		z-index: 2;
	}

	.date-column,
	.date-cell {
		padding: 8px;
		border-left: 1px solid #eee;
	}

	.date-column {
		text-align: center;
	}

	.date-cell {
		display: flex;
		align-items: flex-start;
	}

	.date-cell label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}

	.date-cell input[type='text'] {
		width: 100%;
		box-sizing: border-box;
	}

	.single-day-cell {
		padding: 5px;
	}

	.user-info {
		display: flex;
		align-items: start;
		gap: 0.2rem;
		flex-direction: column;
	}

	.user-info .badges{
		display: flex;
		flex-direction: row;
		gap: .2rem;
	}

	.user-name {
		white-space: nowrap;
	}

	input[disabled] {
		cursor: not-allowed;
	}
</style>
