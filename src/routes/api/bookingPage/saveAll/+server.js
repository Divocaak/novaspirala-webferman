import { pool } from '$lib/db/mysql.js';

export async function POST({ request }) {
    const bookings = await request.json();
    if (!Array.isArray(bookings)) return new Response(JSON.stringify({ error: 'Invalid bookings data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const booking of bookings) {
            await connection.query(
                `
				INSERT INTO user_event (
					id_event,
					id_role,
					id_user,
					comment,
					active
				)
				VALUES (?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE
					comment = VALUES(comment),
					active = VALUES(active)
				`,
                [
                    booking.id_event,
                    booking.id_role,
                    booking.id_user,
                    booking.comment ?? '',
                    booking.active ? 1 : 0
                ]
            );
        }
        await connection.commit();
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to save bookings' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
        connection.release();
    }
}