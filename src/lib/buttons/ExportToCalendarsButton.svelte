<script>
	export let event;

	const formatDateForICS = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}${month}${day}`;
	};

	const getLocation = () =>
		`${event.addr_label || ''}, ${event.addr_street || ''}, ${event.addr_postal || ''} ${event.addr_town || ''}, ${event.addr_country_code || ''}`;

	const generateICS = () => {
		const endDate = new Date(event.date_to);
		endDate.setDate(endDate.getDate() + 1);

		const icsContent = `BEGIN:VCALENDAR
			VERSION:2.0
			PRODID:-//FermanNovaSpirala//EN
			BEGIN:VEVENT
			UID:${Date.now()}@fermannovaspirala.cz
			DTSTAMP:${formatDateForICS(new Date())}
			DTSTART;VALUE=DATE:${formatDateForICS(event.date_from)}
			DTEND;VALUE=DATE:${formatDateForICS(endDate)}
			SUMMARY:${event.label}
			DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}
			LOCATION:${getLocation()}
			END:VEVENT
			END:VCALENDAR`;

		// Create download link
		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${event.label}.ics`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const openGoogleCalendar = () => {
		const start = formatDateForICS(event.date_from);
		const endDate = new Date(event.date_to);
		endDate.setDate(endDate.getDate() + 1);
		const end = formatDateForICS(endDate);

		const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
		const url = `${base}&text=${encodeURIComponent(event.label)}
			&dates=${start}/${end}
			&details=${encodeURIComponent(event.description || '')}
			&location=${encodeURIComponent(getLocation())}
			&ctz=Europe/Prague`;
		window.open(url, '_blank');
	};
</script>

<div class="wrapper">
	<button on:click={openGoogleCalendar}>Přidat do Google Kalendáře</button>
	<button on:click={generateICS}>Stáhnout pro Apple/Outlook</button>
</div>

<style>
	.wrapper {
		display: flex;
		gap: 1rem;
	}
	button {
		cursor: pointer;
		padding: 0.6rem 1.2rem;
		color: #5755d9;
		background: none;
		border: 1px solid #5755d9;
		border-radius: 4px;
	}
	button:hover {
		background: #f0f0ff;
	}
</style>
