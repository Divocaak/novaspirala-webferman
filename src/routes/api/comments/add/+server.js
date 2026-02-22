import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const { id_event, id_role, id_created_by, comment } = await request.json();
    if (!comment?.trim()) return json({ error: 'Empty comment' }, { status: 400 });

    const [sql, _] = await pool.query(`INSERT INTO event_role_comment (id_event, id_role, id_created_by, comment) VALUES (?, ?, ?, ?)`,
        [id_event, id_role, id_created_by, comment]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}