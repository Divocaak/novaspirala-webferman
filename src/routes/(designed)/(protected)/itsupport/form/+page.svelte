<script>
	import { goto } from '$app/navigation';
	import { User } from '$lib/classes/user';

	export let data;
	const user = User.fromJSON(data.user);
	let label;
	let description;

	let error = '';
	let success = '';
	async function handleSubmit(e) {
		e.preventDefault();

		try {
			const res = await fetch('/api/itTasks/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					label,
					description,
					uid: user.id
				})
			});

			if (!res.ok) {
				const { message } = await res.json();
				throw new Error(message);
			}

			alert(`Požadavek vytvořen`);

			success = 'Uloženo';
			error = '';

			await goto('/itsupport');
		} catch (err) {
			console.log(err);
			error = err.message;
			success = '';
		}
	}
</script>

<a href="/itsupport">zpět</a><br />

<form on:submit={handleSubmit}>
	<label>
		* Název
		<input type="text" bind:value={label} required maxlength="32" />
	</label><br />

	<label>
		Popis<br />
		<textarea rows="20" cols="70" maxlength="256" bind:value={description}> </textarea>
	</label><br />

	{#if error}
		<p style="color:red">{error}</p>
	{/if}

	{#if success}
		<p style="color:green">{success}</p>
	{/if}

	<button type="submit">Uložit</button>
</form>
