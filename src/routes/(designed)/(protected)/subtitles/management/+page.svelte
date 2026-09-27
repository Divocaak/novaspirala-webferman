<script>
	export let data;
</script>

<a href="/subtitles">zpět</a><br />
<h2>Správa titulků</h2>
<a href="/subtitles/management/form">Přidat titulky</a><br />

<table>
	<thead>
		<tr>
			<th scope="col">Název</th>
			<th scope="col">Jazyky</th>
			<th scope="col"></th>
		</tr>
	</thead>

	<tbody>
		{#each data.subtitles as subtitle}
			<tr>
				<td>{subtitle.fileName}</td>
				<td>{subtitle.languages.join(', ')}</td>
				<td><a href={`/subtitles/management/form?id=${subtitle.fileName}`}>Upravit</a></td>
			</tr>
		{/each}
	</tbody>
</table>
