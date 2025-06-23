// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();

    const [rows, fields] = await pool.query(`SELECT u.id, u.email, u.phone, u.f_name, u.l_name, s.id AS statusId, s.label AS statusLabel
        FROM user_structure us
        INNER JOIN user u ON us.id_user=u.id
        INNER JOIN user_status ust ON ust.id_user=u.id
        INNER JOIN status s ON ust.id_status=s.id
        WHERE us.id_structure=?;`,
        data.sid);

    return new Response(JSON.stringify(rows));
}