import { pool } from "$lib/db/mysql.js";
import { unlink } from "fs/promises";
import path from "path";

export async function POST({ request }) {
    const { fileId } = await request.json();

    const [rows] = await pool.query(
        `SELECT * FROM event_files WHERE id = ?`,
        [fileId]
    );

    const file = rows[0];
    if (!file) return new Response("Forbidden", { status: 403 });

    await unlink(path.join("dynamic", String(file.id_event), file.file_name));
    await pool.query(
        `DELETE FROM event_files WHERE id = ?`,
        [fileId]
    );

    return new Response(JSON.stringify({ ok: true }));
}