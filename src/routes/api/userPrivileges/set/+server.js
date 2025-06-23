// @ts-nocheck
import { pool } from "$lib/db/mysql.ts";

export async function POST({ params, request }) {
    const data = await request.json();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        for (let [key, value] of Object.entries(data.updates)) {
            await connection.query("INSERT INTO user_privilege (id_user, id_privilege, id_structure, active) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE active = ?",
                [parseInt(data.uid), value.id_privilege, value.id_structure, value.active, value.active]
            );
        }

        await connection.commit();
        return new Response(JSON.stringify({ success: true, message: "updated" }), { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error during transaction:', error);
        return new Response(JSON.stringify({ success: false, message: "error" }), { status: 500 });
    } finally {
        connection.release();
    }
}