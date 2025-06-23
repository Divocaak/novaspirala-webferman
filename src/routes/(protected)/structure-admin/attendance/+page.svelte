<script>
	// @ts-nocheck
	import QRCode from '@castlenine/svelte-qrcode';
	import { page } from '$app/stores';

	export let data;
    // TODO attendance api endpoint
	const qrDataPrefix = `${$page.url.origin}/api/attendance/`;
	
    let inDownloadUrl = '';
	const handleInDownloadUrlGenerated = (generated = '') => (inDownloadUrl = generated);
	let outDownloadUrl = '';
	const handleOutDownloadUrlGenerated = (generated = '') => (outDownloadUrl = generated);
</script>

<h2>docházkový systém v rámci budovy</h2>
<a href="/structure-admin">zpět</a><br />

<h3>příchozí qr kód</h3>
<div style="width: 10%; height: 10%;">
	<QRCode
		data="{qrDataPrefix}in/{data.sid}"
		isJoin
		isResponsive
		downloadUrlFileFormat="svg"
		dispatchDownloadUrl
		on:downloadUrlGenerated={(event) => handleInDownloadUrlGenerated(event.detail.url)}
	/>
</div>
{#if inDownloadUrl}
	<a href={inDownloadUrl} download="vstupni_qr.svg" target="_blank">uložit (.svg)</a>
{/if}

<h3>odchozí qr kód</h3>
<div style="width: 10%; height: 10%;">
	<QRCode
		data="{qrDataPrefix}out/{data.sid}"
		isJoin
		isResponsive
		downloadUrlFileFormat="svg"
		dispatchDownloadUrl
		on:downloadUrlGenerated={(event) => handleOutDownloadUrlGenerated(event.detail.url)}
	/>
</div>
{#if outDownloadUrl}
	<a href={outDownloadUrl} download="odchozi_qr.svg" target="_blank">uložit (.svg)</a>
{/if}