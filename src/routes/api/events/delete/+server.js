import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result;
    await pool.query("UPDATE event SET active=0 WHERE id=?;", url.searchParams.get("id"));

    return new Response(JSON.stringify({ status: 200, message: "upraveno v db" }, { status: 200 }));
}