// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query('SELECT id_privilege, active FROM user_privilege WHERE id_user=? AND id_structure=?;', [url.searchParams.get("uid"), url.searchParams.get("sid")]);

    return new Response(JSON.stringify(rows));
}