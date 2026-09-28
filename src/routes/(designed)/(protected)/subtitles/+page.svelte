<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { User } from '$lib/classes/user.js';
	import DateFilter from '$lib/DateFilter.svelte';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';

	export let data;

	const user = User.fromJSON(data.user);

	$: params = $page.url.searchParams;
	function updateParams(updates) {
		const next = new URLSearchParams(params);

		for (const [key, value] of Object.entries(updates)) {
			if (!value) next.delete(key);
			else next.set(key, value);
		}

		goto(`/subtitles?${next.toString()}`);
	}
</script>

<a href="/">zpět</a><br />
<h2>Titulky</h2>
{#if user.isSubtitlesRoleManager()}<a href="/subtitles/management">Spravovat titulky</a><br />{/if}

<DateFilter {params} onChange={updateParams} />

<table>
	<thead>
		<tr>
			<th scope="col">ID eventu (db)</th>
			<th scope="col">Název akce</th>
			<th scope="col">Datum</th>
			<th scope="col">Titulky</th>
			<th scope="col"></th>
		</tr>
	</thead>

	<tbody>
		{#each data.eventsWithSubtitles as event}
			<tr>
				<td>{event.id}</td>
				<td>{event.label}</td>
				<td><LocalisedDateRange from={event.date_from} to={event.date_to} wrap={true} /></td>
				<td>
					<b>{event.subtitles_name}<br /></b>
					(<i>{event.languages.join(', ')}</i>)
				</td>
				<td>
					{#if event.operatorId === user.id}
						<a href={`/subtitles/operate?eid=${event.id}&sid=${event.subtitles_name}`}>Odbavovat</a>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
