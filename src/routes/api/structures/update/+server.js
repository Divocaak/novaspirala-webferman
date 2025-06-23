// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE structure SET label=?, addr_label=?, addr_street=?, addr_town=?, addr_postal=?, addr_country_code=? WHERE id=?;", [
        data.label,
        data.addr_label,
        data.addr_street,
        data.addr_town,
        data.addr_postal,
        data.addr_country_code,
        data.id
    ]);

    return new Response(JSON.stringify({ status: 200, message: "upraveno v db" }, { status: 200 }));
}