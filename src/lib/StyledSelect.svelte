<script>
	import { createEventDispatcher } from 'svelte';

	export let id = '';
	export let label = '';
	export let required = false;

	export let options = [];
	export let value = null;

    const dispatch = createEventDispatcher();

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}

	function selectOption(option) {
		value = option;
		isOpen = false;
        dispatch('input', value);
	}
</script>

<label for={id}>
	{#if required}*&nbsp;{/if}{label}
</label>
<div class="custom-select {isOpen ? 'open' : ''}">
	<button
		class="selected"
		on:click={toggle}
		style="background-color: {value?.bgClr || '#eee'}; color: {value?.txtClr ||
			'#000'};"
	>
		{value?.label || 'Vybrat'}
	</button>

	<div class="options">
		{#each options as option}
			<button
				class="option"
				on:click={() => selectOption(option)}
				style="background-color: {option.bgClr}; color: {option.txtClr};"
			>
				{option.label}
			</button>
		{/each}
	</div>

	<!-- Hidden native input for form submission -->
	<input type="hidden" {id} value={value?.value || ''} {required} />
</div>
<br />

<style>
	label,
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
	}
	.option:hover {
		opacity: 0.8;
	}
</style>
