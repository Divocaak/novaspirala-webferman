<script>
	import { getLocalisedDate } from "./localisedDateRangeText";

	export let from;
	export let to;
</script>

<p>{getLocalisedDate(from)}&nbsp;-&nbsp;{getLocalisedDate(to)}</p>
