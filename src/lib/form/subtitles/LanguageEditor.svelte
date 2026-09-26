<script>
	export let language;
	export let removeLanguage;
	export let syncScroll;

	function getLineNumbers(text) {
		const lines = Math.max(1, text.split('\n').length);
		return Array.from({ length: lines }, (_, i) => i + 1);
	}

	async function pasteFormatted() {
		const text = await navigator.clipboard.readText();

		const formatted = text
			.replace(/\s+/g, ' ')
			.replace(/,\s*/g, ',\n')
			.replace(/\.\s+/g, '.\n')
			.trim();

		language.text = formatted;
	}
</script>

<div class="language">
	<label>
		<div class="language-header">
			{language.name}
			<button type="button" onclick={() => removeLanguage(language.code)}>&cross;</button>
			<button type="button" onclick={pasteFormatted}> Vložit formátované</button>
		</div>

		<div class="editor">
			<div class="line-numbers">
				{#each getLineNumbers(language.text ?? '') as number}
					<div>{number}</div>
				{/each}
			</div>

			<textarea bind:value={language.text} onscroll={syncScroll}></textarea>
		</div>
	</label>
</div>

<style>
	.language {
		flex: 0 0 400px;
		min-width: 400px;
	}

	.language-header {
		height: 2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.editor {
		display: flex;
		min-height: 400px;
		height: 400px;
	}

	.line-numbers {
		flex: 0 0 2.5rem;
		width: 2.5rem;
		overflow: hidden;
		background: #eee;
		text-align: right;
		font-family: monospace;
		font-size: 0.7rem;
		line-height: 1.2rem;
		padding: 0.1rem 0.4rem;
		box-sizing: border-box;
		user-select: none;
	}

	.line-numbers div {
		height: 1.2rem;
	}

	.language textarea {
		display: block;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		min-width: 400px;
		resize: none;
		font-family: monospace;
		font-size: 0.7rem;
		line-height: 1.2rem;
		padding: 0.1rem;
		white-space: pre;
		overflow-wrap: normal;
		overflow-x: auto;
		overflow-y: auto;
	}
</style>
