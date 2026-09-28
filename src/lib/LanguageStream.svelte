<script>
	export let language;
	export let activeLine = 0;
	export let selectedLine = 1;
	export let onSelectLine = () => {};

	$: lines = (language.text ?? '').split('\n');
</script>

<div class="language">
	<div class="language-header">
		<i>{language.code}</i>
	</div>

	<div class="stream">
		<div class="line-numbers">
			{#each lines as _, index}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class:active={index === activeLine}
					class:selected={index === selectedLine}
					onclick={() => onSelectLine(index)}
				>
					{index + 1}
				</div>
			{/each}
		</div>

		<div class="lines">
			{#each lines as line, index}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="line"
					class:active={index === activeLine}
					class:selected={index === selectedLine}
					onclick={() => onSelectLine(index)}
				>
					{line || '\u00A0'}
				</div>
			{/each}
		</div>
	</div>
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

	.stream {
		display: flex;
		height: 400px;
		overflow: hidden;
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
		box-sizing: border-box;
	}

	.lines {
		flex: 1;
		overflow: hidden;
		font-family: monospace;
		font-size: 0.7rem;
		line-height: 1.2rem;
		padding: 0.1rem;
		box-sizing: border-box;
	}

	.line {
		height: 1.2rem;
		box-sizing: border-box;
		white-space: pre;
		overflow: hidden;
	}

	.line.active,
	.line-numbers div.active {
		background: yellow;
	}

	.line.selected,
	.line-numbers div.selected {
		outline: 2px solid black;
		outline-offset: -2px;
	}

	.line.active.selected,
	.line-numbers div.active.selected {
		background: yellow;
	}
</style>
