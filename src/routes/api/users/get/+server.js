// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function GET({ request, params, url }) {
    let result;
    await pool.query("SELECT id, email, phone, f_name, l_name FROM user WHERE id=?", url.searchParams.get("id"))
        .then(([rows, fields]) => result = rows[0]);

    return new Response(JSON.stringify(result));
}