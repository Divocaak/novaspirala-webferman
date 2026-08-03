import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE it_task SET id_status=?, status_modified_at=CURRENT_TIMESTAMP() WHERE id=?;", [
        parseInt(data.id_status),
        data.id_task
    ]);

    return new Response(JSON.stringify({ status: 200, message: "Stav upraven" }, { status: 200 }));
}