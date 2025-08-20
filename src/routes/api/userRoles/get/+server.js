import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query('SELECT id_role, active, manager FROM user_role WHERE id_user=?;', url.searchParams.get("uid"));

    return new Response(JSON.stringify(rows));
}