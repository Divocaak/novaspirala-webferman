<script>
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

	function toggleOption(option) {
		if (readonly) return;

		const index = value.findIndex((v) => v.id === option.id);

		value =
			index === -1
				? [...value, withNote ? { ...option, note: '' } : option]
				: [...value.slice(0, index), ...value.slice(index + 1)];

		dispatch('input', value);
		dispatch('change', { value });
	}

	function updateNote(optionId, note) {
		const index = value.findIndex((v) => v.id === optionId);
		if (index === -1) return;

		value[index] = { ...value[index], note };
		value = [...value]; // trigger reactivity

		dispatch('input', value);
		dispatch('change', { value });
	}

	const isSelected = (option) => value.some((v) => v.id === option.id);
	const getNote = (option) => value.find((v) => v.id === option.id)?.comment ?? '';

	function selectAll() {
		if (readonly) return;
		value = options.map((option) => (withNote ? { ...option, note: '' } : option));
		dispatch('input', value);
		dispatch('change', { value });
	}

	function resetAll() {
		if (readonly) return;
		value = [];
		dispatch('input', value);
		dispatch('change', { value });
	}

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
</script>

<b>
	{#if required}*{/if}{label}
</b>

{#if !readonly}
	<div class="actions">
		<button type="button" on:click={selectAll}>Vybrat vše</button>
		<button type="button" on:click={resetAll} disabled={value.length === 0}> Zrušit výběr </button>
	</div>
{/if}

<div class="multi-select-checkbox" aria-multiselectable="true" role="listbox">
	{#each options as option (option.id)}
		{@const userVacations = vacationMap.get(option.id) ?? []}

		<label
			class="option"
			for={id}
			aria-selected={isSelected(option)}
			class:booked={option.booked}
			class:on-vacation={userVacations.length > 0}
		>
			{#key value}
				<input
					type="checkbox"
					name={id}
					value={option.id}
					checked={isSelected(option)}
					on:change={() => toggleOption(option)}
					disabled={readonly}
				/>
			{/key}

			<span class="user-info">
				<span class="user-name">
					{option.label}
				</span>

				{#each userVacations as vacation (vacation.id)}
					<span class="vacation-badge">
						DOVOLENÁ
						{getLocalisedDate(vacation.date_from, false)}
						–
						{getLocalisedDate(vacation.date_to, false)}
					</span>
				{/each}
			</span>

			{#if withNote}
				<input
					type="text"
					name="note-{id}"
					placeholder="Poznámka (např. příchod 18:30)"
					value={getNote(option)}
					on:input={(e) => updateNote(option.id, e.target.value)}
					disabled={readonly}
				/>
			{/if}
		</label>
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
		max-height: 142px;
		overflow-y: auto;
		width: 50%;
	}

	.option {
		display: flex;
		align-items: center;
		padding: 3px 0;
		cursor: pointer;
	}

	.option input[type='checkbox'] {
		margin-right: 8px;
	}

	.option[aria-selected='true'] {
		background-color: #def;
		color: #013;
	}

	input[disabled] {
		cursor: not-allowed;
	}

	.booked {
		background-color: #80ef80;
		border-radius: 0.5rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem;
		flex: 1;
	}

	.user-name {
		white-space: nowrap;
	}

	.vacation-badge {
		display: inline-block;
		padding: 2px 5px;
		border-radius: 3px;
		background: #ff6961;
		color: white;
		font-size: 0.7rem;
		font-weight: bold;
		white-space: nowrap;
	}
</style>
