<script>
	export let data;
</script>

<h2>eventy</h2>
<a href="/home">zpět</a><br />
<a href="/events/form">add</a>

<table>
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">label</th>
			<th scope="col">address</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.events as event}
			<tr>
				<!-- <td>
					{venue.id}
				</td>
				<td style="background-color: {venue.bgClr}">
					<b style="color: {venue.txtClr}">{venue.label}</b>
				</td>
				<td>
					<b>{venue.addr_label}</b><br>({venue.addr_street},<br>{venue.addr_postal}&nbsp;{venue.addr_town}, {venue.addr_country_code})
				</td>
				<td>
					<a href="/sysadmin/venues/form?id={venue.id}">edit</a>
				</td> -->
			</tr>
		{/each}
	</tbody>
</table>
