// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE user_status SET id_status=? WHERE id_user=?;", [
        parseInt(data.sid),
        parseInt(data.uid)
    ]);

    return new Response(JSON.stringify({ status: 200, message: "upraveno v db" }, { status: 200 }));
}