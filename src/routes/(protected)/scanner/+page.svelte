<script>
	// @ts-nocheck
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);

	let scanning = false;
	let html5Qrcode;
	onMount(() => {
		html5Qrcode = new Html5Qrcode('reader');
		start();
	});

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			onScanFailure
		);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
	}

	async function onScanSuccess(decodedText, decodedResult) {
		console.log(`Code matched = ${decodedText}`);

		const [apiRoute, queryString] = decodedText.split('?');
		const params = Object.fromEntries(new URLSearchParams(queryString));
		params.uid = user.id;

		console.log(params);

		const response = await fetch(apiRoute, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params)
		});

		if (response.ok) {
			alert('success');
		} else {
			const data = await response.json();
			alert(data.message);
		}
	}

	function onScanFailure(error) {
		console.warn(`Code scan error = ${error}`);
	}

	function test() {
		onScanSuccess(`/api/qr/transaction?pid=1`);
	}
</script>

<h2>qr scanner</h2>
<a href="/home">back to home</a><br />

<main>
	<button on:click={test}>tst</button>
	{#if scanning}
		<button on:click={stop}>stop</button>
	{:else}
		<button on:click={start}>start</button>
	{/if}
	<reader id="reader"></reader>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	reader {
		width: 50%;
		min-height: 500px;
		background-color: black;
	}
</style>
