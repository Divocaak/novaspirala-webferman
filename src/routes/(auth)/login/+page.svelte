<script>
	// @ts-nocheck

	let email = '';
	let password = '';
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (response.ok) {
			window.location = '/';
		} else {
			const data = await response.json();
			error = data.message;
		}
	}
</script>

<form on:submit={handleSubmit}>
	<label for="email">email</label>
	<input id="email" type="email" bind:value={email} required /><br />

	<label for="password">Password</label>
	<input id="password" type="password" bind:value={password} required /><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	<button type="submit">Login</button><br />
	<a href="/register">register</a><br />
	<a href="/">back to homepage</a><br />
</form>
