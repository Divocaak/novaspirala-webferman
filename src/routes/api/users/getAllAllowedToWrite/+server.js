import { PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_WRITE } from "$env/static/public";
import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.query(`SELECT u.id, u.login, u.f_name, u.l_name
        FROM user_privilege up
        INNER JOIN user u ON up.id_user=u.id
        WHERE (up.id_privilege = ?
        OR up.id_privilege = ?)
        AND up.active IS TRUE;`,
        [PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_WRITE]);

    return new Response(JSON.stringify(rows));
}