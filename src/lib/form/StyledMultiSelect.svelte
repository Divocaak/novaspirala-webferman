<script>
	import { createEventDispatcher } from 'svelte';

	export let id = '';
	export let label = '';
	export let required = false;
	export let readonly = false;
	export let options = [];
	export let value = []; // [{ id, label, note? }]
	export let withNote = false;

	const dispatch = createEventDispatcher();

	function toggleOption(option) {
		if (readonly) return;

		// add : remove option
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

	// helper to check if option is selected
	const isSelected = (option) => value.some((v) => v.id === option.id);
	const getNote = (option) => value.find((v) => v.id === option.id)?.note ?? '';
</script>

<b>
	{#if required}*
	{/if}{label}
</b>
<div class="multi-select-checkbox" aria-multiselectable="true" role="listbox">
	{#each options as option (option.id)}
		<label class="option" for={id} aria-selected={isSelected(option)} class:booked={option.booked}>
			<input
				type="checkbox"
				name={id}
				value={option.id}
				checked={isSelected(option)}
				on:change={() => toggleOption(option)}
				disabled={readonly}
			/>
			{option.label}
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
</style>
