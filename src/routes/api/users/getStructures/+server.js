// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ request }) {

    const data = await request.json();
    const [rows, fields] = await pool.query('SELECT s.id, s.label FROM user_structure us INNER JOIN structure s ON s.id=us.id_structure WHERE us.id_user=? AND us.active=1;', data.uid);

    return new Response(JSON.stringify(rows));
}