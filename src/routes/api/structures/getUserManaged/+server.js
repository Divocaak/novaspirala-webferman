// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();

    const [rows, fields] = await pool.query(`SELECT s.id, s.label FROM structure s
        INNER JOIN user_privilege us ON us.id_structure=s.id
        WHERE us.id_user=? AND us.id_privilege=? AND us.active IS TRUE;`,
        [data.uid, data.pid]);

    return new Response(JSON.stringify(rows));
}