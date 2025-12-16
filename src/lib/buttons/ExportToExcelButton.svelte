<script>
	import * as XLSX from 'xlsx';
	import LocalisedDateRange from '$lib/locale/LocalisedDateRange.svelte';
	import { getLocalisedDate } from '$lib/locale/localisedDateRangeText';

	export let events;
	export let roles;

	function exportToExcel() {
		if (!events?.length) {
			alert('Žádná data');
			return;
		}

		const rows = events.map((e) => {
			const base = {
				"ID": e.id,
				"ID Objednávky": e.id_order,
				"Název": e.label,
				"Od": getLocalisedDate(e.date_from),
				"Do": getLocalisedDate(e.date_to),
				"Popis": e.description,
				"Vytvořil": `${e.f_name} ${e.l_name} (${e.phone})`,
				"Prostor": e.vLabel,
				"Žánr/typ": e.gLabel,
			};

			roles.forEach((role) => {
				const assigned = e.users
					.filter((u) => u.id_role === role.id)
					.map((u) => `${u.f_name} ${u.l_name} (${u.phone ?? ''})`)
					.join(', ');

				base[role.label] = assigned;
			});

			return base;
		});

		const worksheet = XLSX.utils.json_to_sheet(rows);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventy');

		const filename = `novaspirala_ferman.xlsx`;
		XLSX.writeFile(workbook, filename);
	}
</script>

<button on:click={exportToExcel}>Export do Excelu</button>
