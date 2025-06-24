import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result;
    await pool.query("SELECT id, label, addr_label, addr_street, addr_town, addr_postal, addr_country_code, text_color, background_color FROM venue WHERE id=?", url.searchParams.get("id"))
        .then(([rows, fields]) => result = rows[0]);

    return new Response(JSON.stringify(result));
}