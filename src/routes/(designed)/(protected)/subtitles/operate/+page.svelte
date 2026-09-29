<script>
	import { goto } from '$app/navigation';
	import LanguageStream from '$lib/LanguageStream.svelte';
	import { onMount } from 'svelte';

	export let data;
	let activeLine = 0;
	let selectedLine = 1;

	$: lineCount = data.subtitle.languages.length
		? Math.max(...data.subtitle.languages.map((language) => language.text.split('\n').length))
		: 0;

	onMount(() => {
		connectWebSocket(data.eid);
		return () => {
			socket?.close();
		};
	});

	function handleKeydown(event) {
		if (lineInputActive) {
			if (/^[0-9]$/.test(event.key)) {
				event.preventDefault();
				lineInput += event.key;
				return;
			}

			if (event.key === 'Backspace') {
				event.preventDefault();
				lineInput = lineInput.slice(0, -1);
				return;
			}

			if (event.key === 'Enter') {
				event.preventDefault();

				const line = Number(lineInput);
				if (line >= 1 && line <= lineCount) selectedLine = line - 1;

				lineInput = '';
				lineInputActive = false;
				return;
			}

			if (event.key === 'Shift') return;

			lineInput = '';
			lineInputActive = false;
			return;
		}

		if (event.key === 'l') {
			event.preventDefault();
			lineInput = '';
			lineInputActive = true;
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedLine = Math.max(0, selectedLine - 1);
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedLine = Math.min(lineCount - 1, selectedLine + 1);
			return;
		}

		if (event.code === 'Space') {
			event.preventDefault();
			activeLine = selectedLine;
			socket?.send(JSON.stringify({ type: 'activate', line: activeLine }));
			selectedLine = Math.min(lineCount - 1, activeLine + 1);
		}
	}

	function selectLine(line) {
		selectedLine = line;
	}

	let lineInput = '';
	let lineInputActive = false;

	let socket;
	function connectWebSocket(eventId) {
		socket = new WebSocket(
			`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/subtitles`
		);

		socket.onopen = () => {
			console.log('Subtitle WebSocket connected');
			socket.send(JSON.stringify({ type: 'operator', eventId }));
		};

		socket.onclose = () => {
			console.log('Subtitle WebSocket disconnected');
		};

		socket.onerror = (error) => {
			console.error('Subtitle WebSocket error:', error);
		};
	}

	function quit() {
		socket?.close();
		goto('/subtitles');
	}
</script>

<svelte:window
	on:keydown={handleKeydown}
	on:click={() => {
		if (lineInputActive) {
			lineInput = '';
			lineInputActive = false;
		}
	}}
/>

{#if lineInputActive}
	<div class="line-jump">
		<span>Řádek</span>
		<!-- svelte-ignore a11y_autofocus -->
		<input value={lineInput} readonly autofocus />
	</div>
{/if}

<div class="languages">
	{#each data.subtitle.languages as language}
		<LanguageStream {language} {activeLine} {selectedLine} onSelectLine={selectLine} />
	{/each}
</div>
<h4>Ovládání</h4>
<p>
	<b>aktivní řádek</b> je zvýrazněn žlutou barvou<br />
	<b>vybraný řádek</b> je ohraničen černým rámečkem<br />
	<b>mezerník</b> udělá z <i>vybraného</i> řádku <i>aktivní</i><br />
	<b>šipkami nahoru a dolů</b> lze změnit <i>vybraný</i> řádek<br />
	<b>
		MARTINE S TĚMAHLE DALŠÍMA DVĚMA POTŘEBUJU JENOM RADU, CHCEME, AŤ TO VYBÍRÁ, NEBO ROVNOU PÁLÍ?
		DÍK, DIVJAK<br /><br />
	</b>
	<b>levým tlačítkem myši</b> na jakýkoliv řádek jej <i>vyberu</i><br />
	<b>klávesa L</b> zobrazí malé okno, které umožňuje zadat číslo řádku. po stisknutní klávesy
	<b>enter</b>
	program <i>vybere</i> požadovaný řádek. jakákoliv jiná klávesa operaci zruší
</p>
<button onclick={quit}>Ukončit stream a vrátit se zpět</button>

<style>
	.languages {
		display: flex;
		gap: 0.1rem;
		align-items: flex-start;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.line-jump {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;

		display: flex;
		align-items: center;
		gap: 0.5rem;

		padding: 0.5rem 0.75rem;
		background: red;
		border: 2px solid black;
		border-radius: 0.3rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);

		font-family: monospace;
		font-size: 0.9rem;
	}

	.line-jump input {
		width: 4rem;
		padding: 0.25rem 0.4rem;

		border: 2px solid black;
		outline: none;

		font: inherit;
		font-weight: bold;
		text-align: center;
	}
</style>
