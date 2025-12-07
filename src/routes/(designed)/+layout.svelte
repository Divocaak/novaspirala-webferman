<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css" />
	<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css" />
</svelte:head>

<h1>Nová Spirála Web Ferman</h1>

<slot />

<style>
	:global(table) {
		border-collapse: collapse;
		margin-top: 20px;

		display: block;
		overflow: auto;
		position: relative;
	}

	:global(td) {
		border: 1.5px solid black;
		padding: 5px;
	}

	:global(tr:nth-child(even)) {
		background-color: #b7b7b7;
	}

	:global(body) {
		margin: 50px !important;
	}

	:global(.custom-btn) {
		all: unset;
		cursor: pointer;
		color: #5755d9;
	}

	:global(input) {
		margin: 10px 0;
	}

	:global(input:last-of-type) {
		margin-bottom: 20px;
	}

	:global(input:read-only, textarea:read-only, input:disabled) {
		background-color: rgb(240, 240, 240);
		color: rgb(118, 118, 118);
		border: none;
	}
</style>
