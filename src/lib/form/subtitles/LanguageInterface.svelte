<script>
	import LanguageEditor from './LanguageEditor.svelte';

	export let selectedLanguages = [];

	const languages = [
		{ code: 'cs', name: 'Čeština' },
		{ code: 'en', name: 'English' },
		{ code: 'de', name: 'Deutsch' },
		{ code: 'sk', name: 'Slovenčina' },
		{ code: 'pl', name: 'Polski' },
		{ code: 'fr', name: 'Français' },
		{ code: 'es', name: 'Español' }
	];

	let showLanguagePicker = false;

	function addLanguage(language) {
		if (selectedLanguages.some((lang) => lang.code === language.code)) return;

		selectedLanguages = [
			...selectedLanguages,
			{
				code: language.code,
				name: language.name,
				text: ''
			}
		];

		showLanguagePicker = false;
	}

	function removeLanguage(code) {
		selectedLanguages = selectedLanguages.filter((lang) => lang.code !== code);
	}

	function syncScroll(event) {
		const source = event.currentTarget;
		const scrollTop = source.scrollTop;
		const scrollLeft = source.scrollLeft;

		document.querySelectorAll('.language textarea').forEach((textarea) => {
			if (textarea === source) return;
			textarea.scrollTop = scrollTop;
			textarea.scrollLeft = scrollLeft;
		});

		document.querySelectorAll('.line-numbers').forEach((numbers) => {
			numbers.scrollTop = scrollTop;
		});
	}
</script>

{#if selectedLanguages.length < languages.length}
	<button type="button" onclick={() => (showLanguagePicker = !showLanguagePicker)}>
		+ Přidat jazyk
	</button>
{/if}

{#if showLanguagePicker}
	<div class="language-picker">
		{#each languages as language}
			{#if !selectedLanguages.some((lang) => lang.code === language.code)}
				<button type="button" onclick={() => addLanguage(language)}>{language.name}</button>
			{/if}
		{/each}
	</div>
{/if}

<div class="languages">
	{#each selectedLanguages as language, index}
		<LanguageEditor
			language={{
				...language,
				name:
					language.name ??
					languages.find((lang) => lang.code === language.code)?.name ??
					language.code
			}}
			{removeLanguage}
			{syncScroll}
		/>
	{/each}
</div>

<style>
	.languages {
		display: flex;
		gap: 0.1rem;
		align-items: flex-start;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}
</style>
