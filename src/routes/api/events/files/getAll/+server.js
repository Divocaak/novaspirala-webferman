import { pool } from "$lib/db/mysql.js";

export async function GET({ url }) {
    const eid = url.searchParams.get("eid");

    const [files] = await pool.query(
        `SELECT id, file_name, original_name, id_created_by, CONVERT_TZ(created_at, '+00:00', '+02:00') AS created_at
		 FROM event_files
		 WHERE id_event = ?
		 ORDER BY created_at DESC`,
        [eid]
    );

    return new Response(JSON.stringify(files));
}