import { pool } from "$lib/db/mysql.js";

export async function GET({ url }) {

    const raw_date_from = url.searchParams.get('date_from');
    const raw_date_to = url.searchParams.get('date_to');
    const id_venue = url.searchParams.get('id_venue');
    const id_genre = url.searchParams.get('id_genre');

    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    const date_from = raw_date_from && raw_date_from !== 'null' ? raw_date_from : formatDate(now);
    const date_to = raw_date_to && raw_date_to !== 'null' ? raw_date_to : formatDate(oneMonthLater);

    let conditions = `WHERE e.active IS TRUE AND e.date_to >= ? AND e.date_from <= ?`;
    let params = [date_from, date_to];

    if (id_venue && id_venue !== 'null') {
        conditions += ` AND e.id_venue = ?`;
        params.push(id_venue);
    }

    if (id_genre && id_genre !== 'null') {
        conditions += ` AND e.id_genre = ?`;
        params.push(id_genre);
    }

    const [rows, fields] = await pool.query(`
        SELECT e.id, e.id_order, e.label, e.date_from, e.date_to, e.description, e.text_color AS txtClr, e.background_color AS bgClr,
        u.id AS createdById, u.login, u.email, u.phone, u.f_name, u.l_name,
        v.label AS vLabel, v.addr_label, v.addr_street, v.addr_town, v.addr_postal, v.addr_country_code, v.text_color AS vTxtClr, v.background_color AS vBgClr,
        g.label AS gLabel, g.note, g.text_color AS gTxtClr, g.background_color AS gBgClr
        FROM event e
        INNER JOIN user u ON e.id_created_by = u.id
        INNER JOIN venue v ON e.id_venue = v.id
        INNER JOIN genre g ON e.id_genre = g.id
        ${conditions}`,
        params);

    const events = rows.map(event => ({
        ...event,
        date_from_ts: new Date(event.date_from).getTime(),
        date_to_ts: new Date(event.date_to).getTime()
    }));

    return new Response(JSON.stringify(events));
}