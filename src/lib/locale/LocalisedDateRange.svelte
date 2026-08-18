<script>
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';

	export let from;
	export let to;
	export let wrap = false;
	export let hours = true;
</script>

<p>{getLocalisedDate(from, hours)}{@html wrap ? '<br />' : '&nbsp;-&nbsp;'}{getLocalisedDate(to, hours)}</p>
