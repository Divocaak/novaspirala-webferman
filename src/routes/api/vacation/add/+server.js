import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    const [sql, _] = await pool.query("INSERT INTO vacation (id_user, date_from, date_to) VALUES (?, ?, ?);", [
        data.uid,
        data.from,
        data.to,
    ]);

    return new Response(JSON.stringify({ status: 200, message: sql.insertId }, { status: 200 }));
}