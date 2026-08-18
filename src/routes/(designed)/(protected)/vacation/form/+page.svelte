<script>
	import { goto } from '$app/navigation';
	import { User } from '$lib/classes/user';
	import DateRanges from '$lib/form/DateRanges.svelte';
	import { createEmptyRange, formatForMySQL } from '$lib/form/dates.js';

	export let data;
	const user = User.fromJSON(data.user);
	let dateRange = [createEmptyRange()];

	let error = '';
	let success = '';
	async function handleSubmit(e) {
		e.preventDefault();

		try {
			if (
				dateRange[0].from &&
				dateRange[0].to &&
				new Date(dateRange[0].to) < new Date(dateRange[0].from)
			) {
				alert('Od musí být dříve než Do');
				return;
			}
			const res = await fetch('/api/vacation/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					uid: user.id,
					from: formatForMySQL(dateRange[0].from),
					to: formatForMySQL(dateRange[0].to)
				})
			});

			if (!res.ok) {
				const { message } = await res.json();
				throw new Error(message);
			}

			alert(`Dovolená uložena`);

			success = 'Uloženo';
			error = '';

			await goto('/vacation');
		} catch (err) {
			console.log(err);
			error = err.message;
			success = '';
		}
	}
</script>

<a href="/vacation">zpět</a><br />

<form on:submit={handleSubmit}>
	<DateRanges bind:ranges={dateRange} single={true} /><br />

	{#if error}
		<p style="color:red">{error}</p>
	{/if}

	{#if success}
		<p style="color:green">{success}</p>
	{/if}

	<button type="submit">Uložit</button>
</form>
