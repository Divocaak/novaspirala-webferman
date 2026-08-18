import { pool } from "$lib/db/mysql.js";

export async function POST({ request }) {

    const data = await request.json();
    await pool.query("UPDATE it_task SET sysadmin_note=? WHERE id=?;", [
        data.note,
        data.id_task
    ]);

    return new Response(JSON.stringify({ status: 200, message: "Poznámka upravena" }, { status: 200 }));
}