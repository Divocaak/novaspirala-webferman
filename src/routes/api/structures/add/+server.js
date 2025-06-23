// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.query("INSERT INTO structure (label, addr_label, addr_street, addr_town, addr_postal, addr_country_code) VALUES (?, ?, ?, ?, ?, ?);", [
        data.label,
        data.addr_label,
        data.addr_street,
        data.addr_town,
        data.addr_country_code
    ]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}