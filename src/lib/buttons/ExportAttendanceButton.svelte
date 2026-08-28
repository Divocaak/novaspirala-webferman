<script>
	import * as XLSX from 'xlsx';
	import { page } from '$app/stores';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';

	export let user;

	async function exportAttendance() {
		const dateFrom = $page.url.searchParams.get('date_from');
		const dateTo = $page.url.searchParams.get('date_to');

		if (!dateFrom || !dateTo) {
			alert('V URL chybí date_from nebo date_to');
			return;
		}

		try {
			// Get events for selected date range
			const eventsRes = await fetch(
				`/api/bookingPage/getAll?${new URLSearchParams({
					date_from: dateFrom,
					date_to: dateTo
				})}`
			);

			if (!eventsRes.ok) throw new Error('Nepodařilo se načíst eventy');
			const eventsData = await eventsRes.json();

			const userRolesResult = await fetch(`/api/userRoles/getManagingRoles?uid=${user.id}`);
			if (!userRolesResult.ok) throw new Error('Nepodařilo se načíst role');
			const userRolesData = await userRolesResult.json();

			const eventIds = eventsData.map((event) => event.id);
			const roleIds = userRolesData.map((role) => role.id);
			let users = [];
			if (eventIds.length > 0 && roleIds.length > 0) {
				const usersRes = await fetch(
					`/api/users/getAllInEventForAttendance?${new URLSearchParams({
						event_ids: eventIds.join(','),
						role_ids: roleIds.join(',')
					})}`
				);
				if (!usersRes.ok) throw new Error('Nepodařilo se načíst uživatele');
				users = await usersRes.json();
			}

			const usersByEventAndRole = {};
			users.forEach((user) => {
				const key = `${user.id_event}-${user.id_role}`;
				if (!usersByEventAndRole[key]) usersByEventAndRole[key] = [];
				usersByEventAndRole[key].push(user);
			});

			const rows = eventsData.map((event) => {
				const base = {
					'ID Objednávky': event.id_order,
					Název: event.label,
					Od: getLocalisedDate(event.date_from),
					Do: getLocalisedDate(event.date_to),
					Popis: event.description,
					Prostor: event.vLabel
				};

				userRolesData.forEach((role) => {
					const key = `${event.id}-${role.id}`;
					const assignedUsers = usersByEventAndRole[key] ?? [];
					base[role.label] = assignedUsers
						.map((user) => `${user.f_name} ${user.l_name} ${user.comment ? `(${user.comment})` : ''}`)
						.join(', ');
				});

				return base;
			});

			const worksheet = XLSX.utils.json_to_sheet(rows);
			const workbook = XLSX.utils.book_new();

			XLSX.utils.book_append_sheet(workbook, worksheet, 'Docházka');

			XLSX.writeFile(workbook, 'novaspirala_dochazka.xlsx');
		} catch (error) {
			console.error('Chyba při exportu:', error);
			alert('Nepodařilo se načíst data pro export.');
		}
	}
</script>

<button on:click={exportAttendance}> Export docházky </button> <br />
