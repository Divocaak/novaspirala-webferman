import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.query("SELECT id, label, note, text_color AS txtClr, background_color AS bgClr FROM role;");

    return new Response(JSON.stringify(rows));
}