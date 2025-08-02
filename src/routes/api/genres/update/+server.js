import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE genre SET label=?, note=?, text_color=?, background_color=? WHERE id=?;", [
        data.label,
        data.note,
        data.text_color,
        data.background_color,
        data.id
    ]);

    return new Response(JSON.stringify({ status: 200, message: "Upraveno" }, { status: 200 }));
}