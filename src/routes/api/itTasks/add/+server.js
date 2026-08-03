import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.query("INSERT INTO it_task (label, description, id_created_by) VALUES (?, ?, ?);", [
        data.label,
        data.description,
        data.uid,
    ]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}