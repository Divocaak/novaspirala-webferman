// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function GET() {
    const [rows, fields] = await pool.query('SELECT id, label, note FROM privilege WHERE id > 1;');

    return new Response(JSON.stringify(rows));
}