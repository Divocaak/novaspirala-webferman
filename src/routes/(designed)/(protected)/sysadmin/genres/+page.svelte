<script>
	export let data;
</script>

<h2>Žánry/typy</h2>
<a href="/sysadmin">Zpět</a><br />
<a href="/sysadmin/genres/form">Přidat</a>

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Název</th>
			<th scope="col">Poznámka</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.genres as genre}
			<tr>
				<td>
					{genre.id}
				</td>
				<td style="background-color: {genre.bgClr}">
					<b style="color: {genre.txtClr}">{genre.label}</b>
				</td>
				<td>
					{genre.note}
				</td>
				<td>
					<a href="/sysadmin/genres/form?id={genre.id}">Upravit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
