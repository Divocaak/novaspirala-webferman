<script>
	import * as XLSX from 'xlsx';

	export let events;
	export let roles;
    export let date_from;
    export let date_to;

	function exportToExcel() {
		if (!events?.length) {
			alert('Žádná data');
			return;
		}

		const rows = events.map((e) => {
			const base = {
				ID: e.id,
				OrderID: e.id_order,
				Label: e.label,
				From: e.date_from,
				To: e.date_to,
				Description: e.description,
				Venue: e.vLabel,
				Genre: e.gLabel,
				CreatedBy: `${e.f_name} ${e.l_name} (${e.phone})`
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

		const filename = `novaspirala_${date_from}_to_${date_to}.xlsx`;
		XLSX.writeFile(workbook, filename);
	}
</script>

<button on:click={exportToExcel}>Export do Excelu</button>
