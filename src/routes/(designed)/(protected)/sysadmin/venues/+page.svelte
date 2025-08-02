<script>
	export let data;
</script>

<h2>Prostory</h2>
<a href="/sysadmin">Zpět</a><br />
<a href="/sysadmin/venues/form">Přidat</a>

<table>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Název</th>
			<th scope="col">Adresa</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.venues as venue}
			<tr>
				<td>
					{venue.id}
				</td>
				<td style="background-color: {venue.bgClr}">
					<b style="color: {venue.txtClr}">{venue.label}</b>
				</td>
				<td>
					<b>{venue.addr_label}</b><br>({venue.addr_street},<br>{venue.addr_postal}&nbsp;{venue.addr_town}, {venue.addr_country_code})
				</td>
				<td>
					<a href="/sysadmin/venues/form?id={venue.id}">Upravit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
