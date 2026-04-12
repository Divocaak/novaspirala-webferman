<script>
	import { invalidateAll } from '$app/navigation';
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
	const eid = data.eid;

	let selectedFiles = [];

	async function upload() {
		const formData = new FormData();
		formData.append('eid', eid);

		for (const f of selectedFiles) formData.append('files', f);
		const res = await fetch('/api/events/files/add', {
			method: 'POST',
			body: formData
		});

		if (!res.ok) {
			alert('Upload failed');
            console.log(res);
			return;
		}

		selectedFiles = [];
		await invalidateAll();
	}

	async function deleteFile(fileId) {
		const res = await fetch('/api/events/files/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fileId, eid })
		});

		if (!res.ok) {
			alert('Delete failed');
            console.log(res);
			return;
		}

		await invalidateAll();
	}
</script>

<a href="/">zpět</a><br />
<h2>Správa souborů</h2>

{#if user.isAllowedToUploadFiles()}
	<input
		type="file"
		multiple
		accept=".jpg,.jpeg,.pdf,.png"
		on:change={(e) => (selectedFiles = [...e.target.files])}
	/>
	{#if selectedFiles.length}<p>{selectedFiles.length} souborů připraveno</p>{/if}
	<button on:click={upload} disabled={!selectedFiles.length}>Nahrát soubory</button>
	<hr />
{/if}

{#each data.files as f}
	<div>
		<a href={`/dynamic/${eid}/${f.file_name}`} target="_blank">{f.original_name}</a>
		<small>({new Date(f.created_at).toLocaleString('cs-CZ')})</small>
		{#if user.isAllowedToDeleteFile(f.id_created_by)}<button on:click={() => deleteFile(f.id)}
				>Smazat</button
			>{/if}
	</div>
{/each}
