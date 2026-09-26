import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const { id_created_by, feedback } = await request.json();
    if (!feedback?.trim()) return json({ error: 'Empty feedback' }, { status: 400 });

    const [sql, _] = await pool.query(`INSERT INTO feedback (id_user, description) VALUES (?, ?)`,
        [id_created_by, feedback]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}