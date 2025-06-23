// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE user SET email=?, phone=?, f_name=?, l_name=? WHERE id=?;", [
        data.email,
        parseInt(data.phone),
        data.f_name,
        data.l_name,
        data.id
    ]);

    return new Response(JSON.stringify({ status: 200, message: "upraveno v db" }, { status: 200 }));
}