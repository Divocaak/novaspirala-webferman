import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE user SET login=?, email=?, phone=?, f_name=?, l_name=? WHERE id=?;", [
        data.login,
        data.email,
        parseInt(data.phone),
        data.f_name,
        data.l_name,
        data.id
    ]);

    return new Response(JSON.stringify({ status: 200, message: "Uživatel upraven" }, { status: 200 }));
}