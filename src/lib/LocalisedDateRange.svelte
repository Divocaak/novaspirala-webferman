<script>
	export let from;
	export let to;

	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};

	export function getLocalisedDate(date) {
		return new Date(date).toLocaleDateString('cs-CZ', options);
	}
</script>

<p>{getLocalisedDate(from)}&nbsp;-&nbsp;{getLocalisedDate(to)}</p>
