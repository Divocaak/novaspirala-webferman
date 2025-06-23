// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function GET() {
    const [rows, fields] = await pool.query('SELECT u.id, u.email, u.phone, u.f_name, u.l_name, s.id AS statusId, s.label AS status FROM user_status us INNER JOIN status s ON us.id_status=s.id INNER JOIN user u ON us.id_user=u.id;');

    return new Response(JSON.stringify(rows));
}