import { pool } from "$lib/db/mysql.js";

export async function GET({ url }) {
	const raw_date_from = url.searchParams.get('date_from');
	const raw_date_to = url.searchParams.get('date_to');

	const now = new Date();
	const oneMonthLater = new Date();
	oneMonthLater.setMonth(now.getMonth() + 1);
	const formatDate = (d) => d.toISOString().split('T')[0];
	const date_from = raw_date_from && raw_date_from !== 'null' ? raw_date_from : formatDate(now);
	const date_to = raw_date_to && raw_date_to !== 'null' ? raw_date_to : formatDate(oneMonthLater);

	let query = `
		SELECT
			v.id,
			v.id_user,
			v.date_from,
			v.date_to,
			u.email,
			u.phone,
			u.f_name,
			u.l_name
		FROM vacation v
		INNER JOIN user u ON v.id_user = u.id
	`;

	const params = [];

	if (date_from && date_to) {
		query += `
			WHERE v.date_from <= ?
			AND v.date_to >= ?
		`;

		params.push(date_to, date_from);
	}

	query += `
		ORDER BY v.date_from;
	`;

	const [rows] = await pool.query(query, params);

	return new Response(JSON.stringify(rows));
}