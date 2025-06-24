<script>
	import { onMount } from 'svelte';
	import { JSONEditor } from '@json-editor/json-editor';

	export let schemaPath, endpoint;
	export let initialData = null;

	let editor, container;

	onMount(async () => {
		const schemaRes = await fetch(schemaPath);
		const schemaData = await schemaRes.json();

		editor = new JSONEditor(container, {
			disable_edit_json: true,
			disable_properties: true,
			disable_array_delete_last_row: true,
			disable_collapse: true,
			compact: true,
			ajax: true,
			theme: 'spectre',
			iconlib: 'spectre',
			schema: schemaData
		});

		editor.on('ready', () => {
			editor.setValue({ id: Date.now() });

			if (initialData) editor.setValue(initialData);
		});

		return () => {
			if (editor) editor.destroy();
		};
	});

	async function saveJSON() {
		if (editor) {
			try {
				const editedData = editor.getValue();
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(editedData)
				});

				const responseData = await response.json();
				if (responseData.status === 200) {
					alert('Saved successfully!');
				} else {
					console.error(responseData);
					alert('Failed to save file. Check console for more information');
				}
			} catch (error) {
				console.error('Error:', error);
				alert('Error saving data.');
			}
		}
	}
</script>

<div class="wrapper">
	<div bind:this={container} class="editor-container"></div>
	<button on:click={saveJSON}>Uložit</button>
</div>

<style>
	.wrapper {
		padding: 25px;
		border: 1px solid var(--black);
	}
</style>
