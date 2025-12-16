<script>
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';

	export let from;
	export let to;
	export let wrap = false;
</script>

<p>{getLocalisedDate(from)}{@html wrap ? '<br />' : '&nbsp;-&nbsp;'}{getLocalisedDate(to)}</p>
