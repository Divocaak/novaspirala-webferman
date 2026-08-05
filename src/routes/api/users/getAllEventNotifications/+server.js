import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query(`
        SELECT en.id, en.id_event, en.id_user_recipient, e.label, e.date_from, e.date_to, e.text_color, e.background_color, en.type
        FROM event_notification en
        INNER JOIN event e ON en.id_event=e.id
        WHERE en.id_user_recipient = ?
        AND en.isRead IS FALSE;`,
        url.searchParams.get("uid"));

    return new Response(JSON.stringify(rows));
}