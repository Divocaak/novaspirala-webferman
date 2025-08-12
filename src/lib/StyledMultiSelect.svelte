<script>
	import { createEventDispatcher } from 'svelte';

	export let id = '';
	export let label = '';
	export let required = false;
	export let readonly = false;
	export let options = [];
	export let value = []; // Array of selected option objects

	const dispatch = createEventDispatcher();

	function toggleOption(option) {
		if (readonly) return;

		const index = value.findIndex((v) => v.id === option.id);
		if (index === -1) {
			// add option
			value = [...value, option];
		} else {
			// remove option
			value = [...value.slice(0, index), ...value.slice(index + 1)];
		}
		dispatch('input', value);
		dispatch('change', { value });
	}

	// helper to check if option is selected
	const isSelected = (option) => value.some((v) => v.id === option.id);
</script>

<b>
	{#if required}*
	{/if}{label}
</b>
<div class="multi-select-checkbox" aria-multiselectable="true" role="listbox">
	{#each options as option (option.id)}
		<label class="option" for={id} aria-selected={isSelected(option)}>
			<input
				type="checkbox"
				name={id}
				value={option.id}
				checked={isSelected(option)}
				on:change={() => toggleOption(option)}
				disabled={readonly}
			/>
			{option.label}</label
		>
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
	}

	input[disabled] {
		cursor: not-allowed;
	}
</style>
