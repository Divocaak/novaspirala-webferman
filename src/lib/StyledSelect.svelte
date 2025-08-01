<script>
	import { createEventDispatcher } from 'svelte';

	export let id = '';
	export let label = '';
	export let required = false;
	export let readonly = false;

	export let options = [];
	export let value = null;

	let nativeSelect;

	const dispatch = createEventDispatcher();

	let isOpen = false;

	function toggle() {
		if (readonly) return;
		isOpen = !isOpen;
	}

	function selectOption(option) {
		value = option;
		isOpen = false;

		if (nativeSelect) nativeSelect.value = option;

		dispatch('input', value);
		dispatch('change', { value });
	}
</script>

<p>
	{#if required}*&nbsp;{/if}{label}
</p>
<div class="custom-select {isOpen ? 'open' : ''}">
	<button
		class="selected"
		on:click={toggle}
		style="background-color: {value?.bgClr || '#eee'}; color: {value?.txtClr || '#000'};"
		class:readonly
		type="button"
	>
		{value?.label || 'Vybrat'}
	</button>

	<div class="options">
		<button
			class="option"
			on:click={() => selectOption(null)}
			style="background-color: #eee; color: #000;"
			type="button">-</button
		>
		{#each options as option}
			<button
				class="option"
				on:click={() => selectOption(option)}
				style="background-color: {option.bgClr ?? '#eee'}; color: {option.txtClr ?? '#000'};"
				type="button"
			>
				{option.label}{option.note ? ` (${option.note})` : ''}
			</button>
		{/each}
	</div>

	<!-- Hidden native input for form submission -->
	<select
		bind:this={nativeSelect}
		{id}
		name={id}
		{required}
		{readonly}
		style="opacity: 0; position: absolute; width: 100%; height: 100%; pointer-events: none;"
		aria-hidden="true"
		tabindex="-1"
	>
		<option value="">Select one</option>
		{#each options as option}
			<option value={option} selected={option == value}>{option.label}</option>
		{/each}
	</select>
</div>
<br />

<style>
	p,
	.custom-select {
		display: inline-block;
	}

	button {
		all: unset;
	}

	.custom-select {
		position: relative;
		width: 200px;
	}
	.selected {
		padding: 5px;
		background: #eee;
		border: 1px solid #ccc;
		cursor: pointer;
	}
	.options {
		display: none;
		position: absolute;
		width: 100%;
		border: 1px solid #ccc;
		z-index: 1000;
	}
	.custom-select.open .options {
		display: block;
	}
	.option {
		padding: 5px;
		cursor: pointer;
		display: block;
		width: 100%;
	}
	.option:hover {
		opacity: 0.8;
	}

	.readonly {
		cursor: unset;
	}
</style>
