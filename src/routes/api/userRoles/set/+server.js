import { pool } from "$lib/db/mysql.js";

export async function POST({ params, request }) {
    const data = await request.json();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const { roleId, active } of data.updates) {
            await connection.query("INSERT INTO user_role (id_user, id_role, active) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE active = ?",
                [data.uid, roleId, active, active]
            );
        }

        await connection.commit();
        return new Response(JSON.stringify({ success: true, message: "Upraveno" }), { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error during transaction:', error);
        return new Response(JSON.stringify({ success: false, message: "Stala se chyba" }), { status: 500 });
    } finally {
        connection.release();
    }
}