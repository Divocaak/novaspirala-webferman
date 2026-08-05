import { pool } from "$lib/db/mysql.js";

export async function POST({ params, request }) {
    const data = await request.json();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        for (const { id, id_event, id_user_recipient } of data.notifications) {
            await connection.query(
                `UPDATE event_notification
		        SET isRead = TRUE
		        WHERE id = ?
		        AND id_event = ?
		        AND id_user_recipient = ?`,
                [
                    id,
                    id_event,
                    id_user_recipient
                ]
            );
        }

        await connection.commit();
        return new Response(JSON.stringify({ success: true, message: "Označeno jako přetené" }), { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error during transaction:', error);
        return new Response(JSON.stringify({ success: false, message: "Stala se chyba" }), { status: 500 });
    } finally {
        connection.release();
    }
}