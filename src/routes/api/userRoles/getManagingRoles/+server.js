import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    const [rows, fields] = await pool.query(`
        SELECT r.id, r.label, r.text_color, r.background_color
        FROM user_role ur
        INNER JOIN role r ON r.id = ur.id_role
        WHERE ur.id_user=?
        AND ur.active IS TRUE
        AND ur.manager IS TRUE
        ;`,
        url.searchParams.get("uid"));

    return new Response(JSON.stringify(rows));
}