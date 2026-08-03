import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.query(`
        SELECT t.id, t.label, t.description, t.created_at, t.status_modified_at, t.sysadmin_note, t.id_status,
        u.email, u.phone, u.f_name, u.l_name,
        s.label AS sLabel, s.text_color AS sTxtClr, s.background_color AS sBgClr
        FROM it_task t
        INNER JOIN user u ON t.id_created_by = u.id
        INNER JOIN status s ON t.id_status = s.id
        ORDER BY t.created_at;
        `);

    return new Response(JSON.stringify(rows));
}