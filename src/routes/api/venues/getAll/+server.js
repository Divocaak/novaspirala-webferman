import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.query("SELECT id, label, addr_label, addr_street, addr_town, addr_postal, addr_country_code, text_color AS txtClr, background_color AS bgClr FROM venue;");

    return new Response(JSON.stringify(rows));
}