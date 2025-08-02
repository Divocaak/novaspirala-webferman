<script>
	let login = '';
	let password = '';
	let passwordAgain = '';
	let email = '';
	let phone = '';
	let fName = '';
	let lName = '';

	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();

		if (password !== passwordAgain) {
			error = 'hesla se neshodují';
			return;
		}

		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password, email, phone, fName, lName })
		});

		if (response.ok) {
			success = 'succ';
			login = password = passwordAgain = '';
			error = '';
		} else {
			const data = await response.json();
			error = data.message || 'e';
		}
	}
</script>

<form on:submit={handleSubmit} autocomplete="off">
	<label for="login">* Login</label>
	<input id="login" type="text" bind:value={login} required maxlength="16" /><br />

	<label for="email">E-mail</label>
	<input id="email" type="email" bind:value={email} maxlength="32"/><br />

	<label for="password">* Heslo</label>
	<input id="password" type="password" bind:value={password} required /><br />

	<label for="passwordAgain">* Heslo znovu</label>
	<input id="passwordAgain" type="password" bind:value={passwordAgain} required /><br />

	<label for="phone">Telefon</label>
	<input id="phone" type="tel" bind:value={phone} /><br />

	<label for="fname">Jméno</label>
	<input id="fname" type="text" bind:value={fName} maxlength="16"/><br />

	<label for="lname">Příjmení</label>
	<input id="lname" type="text" bind:value={lName} maxlength="16"/><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
		<br />
	{/if}

	<button type="submit">Vytvořit účet</button><br />
	<a href="/login">Přihlásit se</a><br />
</form>
