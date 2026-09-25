<script>
	import SveltyPicker from 'svelty-picker';

	export let value = '';
	export let onChange = () => {};

	function handleChange(event) {
		if (!event) {
			onChange('');
			return;
		}

		const month = event.substring(0, 7);
		onChange(month);
	}
</script>

<SveltyPicker
	value={value ? `${value}-01` : ''}
	mode="date"
	format="yyyy-mm-dd"
    displayFormat="yyyy-mm"
	onChange={handleChange}
/>
