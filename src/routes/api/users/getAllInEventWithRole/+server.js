import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query(`SELECT u.id, u.login, u.f_name, u.l_name, u.email, u.phone, ue.id_role
        FROM user_event ue
        INNER JOIN user u ON ue.id_user=u.id
        WHERE ue.id_event = ?
        AND ue.active IS TRUE;`,
        url.searchParams.get("eid"));

    return new Response(JSON.stringify(rows));
}
