<script>
	import { onMount } from 'svelte';

	export let event;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.addevent.com/libs/atc/1.6.1/atc.min.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
	});

	const getUsableDate = (date) => {
		const dateDate = new Date(date);
		const year = dateDate.getFullYear();
		const month = (dateDate.getMonth() + 1).toString().padStart(2, '0');
		const day = dateDate.getDate().toString().padStart(2, '0');
		return `${day}/${month}/${year}`;
	};
</script>

<div class="wrapper">
	<div title="Přidat do kalendáře" class="addeventatc" data-dropdown-y="up">
		<p>Přidat do kalendáře</p>
		<span class="start">{getUsableDate(event.date_from)}</span>
		<span class="end">{getUsableDate(event.date_to)}</span>
		<span class="all_day_event">true</span>
		<span class="date_format">DD/MM/YYYY</span>
		<span class="timezone">Europe/Prague</span>
		<span class="title">{event.label}</span>
		<span class="description">{event.description}</span>
		<span class="location">
			{event.addr_label}, {event.addr_street}, {event.addr_postal}
			{event.addr_town}, {event.addr_country_code}
		</span>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.addeventatc {
		all: unset;

		box-shadow: none !important;
		cursor: pointer;
		padding: 0.6rem 1.2rem;
		z-index: 1000;
	}

	.addeventatc p {
		all: unset;

		position: relative;
		color: #5755d9;
		font-size: medium;

		padding-left: 1.25rem;
		padding-top: 0.25rem;
	}

	.addeventatc:hover {
		background-color: transparent;
	}
</style>
