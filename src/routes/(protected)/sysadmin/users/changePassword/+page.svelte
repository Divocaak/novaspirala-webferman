<script>
	export let data = null;

	let currentPassword = '';
	let password = '';
	let passwordAgain = '';
	let success = '';
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();

		if (password !== passwordAgain) {
			error = 'passwords do not match';
			return;
		}

		const response = await fetch('/api/auth/changePassword', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uid: data.uid, currentPassword, password })
		});

		if (response.ok) {
			success = 'succ';
			currentPassword = password = passwordAgain = '';
			error = '';
		} else {
			const data = await response.json();
			error = data.message || 'e';
		}
	}
</script>

<a href="/sysadmin/users">zpět</a><br />

<form on:submit={handleSubmit} autocomplete="off">
	<label for="currentPassword">* current password</label>
	<input id="currentPassword" type="password" bind:value={currentPassword} required /><br />

	<label for="password">* new password</label>
	<input id="password" type="password" bind:value={password} required /><br />

	<label for="passwordAgain">* new password again</label>
	<input id="passwordAgain" type="password" bind:value={passwordAgain} required /><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
		<br />
	{/if}

	<button type="submit">změnit heslo</button><br />
</form>
