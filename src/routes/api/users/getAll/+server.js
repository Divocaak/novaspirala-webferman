import { pool } from "$lib/db/mysql.js";

export async function GET() {
    const [rows, fields] = await pool.query('SELECT id, login, email, phone, f_name, l_name FROM user;');

    return new Response(JSON.stringify(rows));
}