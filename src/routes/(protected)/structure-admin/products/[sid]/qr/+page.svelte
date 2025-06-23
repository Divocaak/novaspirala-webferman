<script>
	// @ts-nocheck
	import QRCode from '@castlenine/svelte-qrcode';
	import { page } from '$app/stores';

	export let data;
	const qrData = `/api/qr/transaction?pid=${data.id}`;
	
    let downloadUrl = '';
	const handleInDownloadUrlGenerated = (generated = '') => (downloadUrl = generated);
</script>

<h2>qr kód pro vytvoření transakce</h2>
<a href="/structure-admin/products/{$page.params.sid}">zpět</a><br />

<div style="width: 10%; height: 10%;">
	<QRCode
		data="{qrData}"
		isJoin
		isResponsive
		downloadUrlFileFormat="svg"
		dispatchDownloadUrl
		on:downloadUrlGenerated={(event) => handleInDownloadUrlGenerated(event.detail.url)}
	/>
</div>
{#if downloadUrl}
	<a href={downloadUrl} download="qr_produkt.svg" target="_blank">uložit (.svg)</a>
{/if}