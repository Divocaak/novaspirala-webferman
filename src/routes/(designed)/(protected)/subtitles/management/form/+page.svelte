<script>
	import { goto } from '$app/navigation';
	import LanguageInterface from '$lib/form/subtitles/LanguageInterface.svelte';

	export let data;

	let readonly = data.subtitle;
	let label = data.subtitle?.fileName ?? '';
	$: fileName = label
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // remove accents
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-') // spaces/special chars → -
		.replace(/^-+|-+$/g, '');

	let selectedLanguages = data.subtitle?.languages ?? [];

	let error = '';
	let success = '';
	async function handleSubmit(e) {
		e.preventDefault();

		try {
            console.log(selectedLanguages);
			const res = await fetch(data.subtitle ? '/api/subtitles/update' : '/api/subtitles/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileName, languages: selectedLanguages })
			});

			if (!res.ok) {
				const { message } = await res.json();
				throw new Error(message);
			}

			alert(`Titulky uloženy`);

			success = 'Uloženo';
			error = '';

			await goto('/subtitles/management');
		} catch (err) {
			console.log(err);
			error = err.message;
			success = '';
		}
	}
</script>

<a href="/subtitles/management">zpět</a><br />

<form on:submit={handleSubmit}>
	<label>
		* Název titulků
		<input type="text" bind:value={label} required {readonly} maxlength="32" />
	</label><br />
	{#if !data.subtitle}<small>Použitý název: <strong>{fileName}</strong></small><br />{/if}

	<LanguageInterface bind:selectedLanguages /><br />

	{#if error}<p style="color:red">{error}</p>{/if}
	{#if success}<p style="color:green">{success}</p>{/if}
	<button type="submit">Uložit</button>
</form>
