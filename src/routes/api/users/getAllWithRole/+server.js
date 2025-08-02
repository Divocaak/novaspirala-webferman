import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query(`SELECT u.id, u.login, u.f_name, u.l_name
        FROM user_role ur
        INNER JOIN user u ON ur.id_user=u.id
        WHERE ur.id_role = ?
        AND ur.active IS TRUE;`,
        url.searchParams.get("rid"));

    return new Response(JSON.stringify(rows));
}