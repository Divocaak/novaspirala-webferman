import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE venue SET label=?, addr_label=?, addr_street=?, addr_town=?, addr_postal=?, addr_country_code=?, text_color=?, background_color=? WHERE id=?;", [
        data.label,
        data.addr_label,
        data.addr_street,
        data.addr_town,
        data.addr_postal,
        data.addr_country_code,
        data.text_color,
        data.background_color,
        data.id
    ]);

    return new Response(JSON.stringify({ status: 200, message: "upraveno v db" }, { status: 200 }));
}