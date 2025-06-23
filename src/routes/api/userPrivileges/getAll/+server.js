// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query('SELECT id_privilege, id_structure, active FROM user_privilege WHERE id_user=?;', url.searchParams.get("uid"));

    return new Response(JSON.stringify(rows));
}