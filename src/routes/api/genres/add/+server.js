import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.query("INSERT INTO genre (label, note, text_color, background_color) VALUES (?, ?, ?, ?);", [
        data.label,
        data.note,
        data.text_color,
        data.background_color,
    ]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}