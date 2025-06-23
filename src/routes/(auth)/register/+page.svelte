<script>
	// @ts-nocheck

	let email = '';
	let password = '';
	let passwordAgain = '';
	let phone = '';
	let fName = '';
	let lName = '';
	let error = '';
	let success = '';

	async function handleSubmit(event) {
		event.preventDefault();

		if (password !== passwordAgain) {
			error = 'passwords do not match';
			return;
		}

		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, phone, fName, lName })
		});

		if (response.ok) {
			success = 'succ';
			username = password = passwordAgain = '';
			error = '';
		} else {
			const data = await response.json();
			error = data.message || 'e';
		}
	}
</script>

<form on:submit={handleSubmit} autocomplete="off">
	<label for="email">* email</label>
	<input id="email" type="email" bind:value={email} required /><br />

	<label for="password">* password</label>
	<input id="password" type="password" bind:value={password} required /><br />

	<label for="passwordAgain">* password check</label>
	<input id="passwordAgain" type="password" bind:value={passwordAgain} required /><br />

	<label for="phone">* tel</label>
	<input id="phone" type="tel" bind:value={phone} required /><br />

	<label for="fname">f nane</label>
	<input id="fname" type="text" bind:value={fName} /><br />

	<label for="lname">l name</label>
	<input id="lname" type="text" bind:value={lName} /><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
		<br />
	{/if}

	<button type="submit">Register</button><br />
	<a href="/login">login</a><br />
	<a href="/">back to homepage</a><br />
</form>
