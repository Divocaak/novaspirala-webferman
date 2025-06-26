<script>
	export let data;
</script>

<h2>žánry</h2>
<a href="/sysadmin">zpět</a><br />
<a href="/sysadmin/genres/form">add</a>

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">label</th>
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
					<a href="/sysadmin/genres/form?id={genre.id}">edit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
