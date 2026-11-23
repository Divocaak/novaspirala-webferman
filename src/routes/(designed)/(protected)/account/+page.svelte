<script>
	import AdminForm from '$lib/form/AdminForm.svelte';
	export let data = null;

	console.log(data.user);
	const { id, login, email, phone, fName, lName } = data.user;
	const userToEdit = { id, login, email, phone, f_name: fName, l_name: lName };

	let currentPassword = '';
	let password = '';
	let passwordAgain = '';
	let success = '';
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();

		if (password.length < 8) {
			error = 'Heslo musí obsahovat alespoň 8 znaků';
			return;
		}

		if (!/[A-Z]/.test(password)) {
			error = 'Heslo musí obsahovat alespoň jedno velké písmeno';
			return;
		}

		if (!/[0-9]/.test(password)) {
			error = 'Heslo musí obsahovat alespoň jednu číslici';
			return;
		}

		if (!/^[a-zA-Z0-9]+$/.test(password)) {
			error = 'Heslo nesmí obsahovat mezery ani speciální znaky';
			return;
		}

		if (password !== passwordAgain) {
			error = 'Nová hesla se neshodují';
			return;
		}

		const response = await fetch('/api/auth/changePassword', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uid: id, currentPassword, password })
		});

		if (response.ok) {
			success = 'Úspěšně uloženo';
			currentPassword = password = passwordAgain = '';
			error = '';
		} else {
			const responseData = await response.json();
			error = responseData.message || 'Chyba při změně hesla';
		}
	}
</script>

<a href="/">Zpět</a><br />

<AdminForm
	schemaPath="/schemas/protected/user.json"
	endpoint="/api/users/update"
	initialData={userToEdit}
/>

<form on:submit={handleSubmit} autocomplete="off">
	<label for="currentPassword">* Aktuální heslo</label>
	<input id="currentPassword" type="password" bind:value={currentPassword} required /><br />

	<label for="password">* Nové heslo</label>
	<input id="password" type="password" bind:value={password} required /><br />

	<label for="passwordAgain">* Nové heslo znovu</label>
	<input id="passwordAgain" type="password" bind:value={passwordAgain} required /><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
		<br />
	{/if}

	<button type="submit">Změnit heslo</button><br />
</form>
