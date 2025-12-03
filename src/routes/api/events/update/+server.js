import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { id, id_venue, id_genre, id_order, label, date_ranges, description, text_color, background_color, roles } = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query(
            `UPDATE event
             SET id_venue = ?, id_genre = ?, id_order = ?, label = ?, date_from = ?, date_to = ?, description = ?, text_color = ?, background_color = ?
             WHERE id = ?`,
            [id_venue, id_genre, id_order, label, date_ranges[0].date_from, date_ranges[0].date_to, description, text_color, background_color, id]
        );

        await connection.query(
            `UPDATE user_event SET active = 0 WHERE id_event = ?`,
            [id]
        );

        if (roles.length > 0) {
            const placeholders = roles.map(() => '(?, ?, ?, 1)').join(', ');
            const values = roles.flatMap(role => [role.uid, role.rid, id]);

            const sql = `
                INSERT INTO user_event (id_user, id_role, id_event, active)
                VALUES ${placeholders}
                ON DUPLICATE KEY UPDATE active = VALUES(active)
            `;

            await connection.query(sql, values);
        }

        await connection.commit();
        return json({ message: 'Event upraven' }, { status: 200 });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        return json({ message: 'Stala se chyba' }, { status: 500 });
    } finally {
        connection.release();
    }
}
