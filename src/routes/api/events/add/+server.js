import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { id_created_by, id_venue, id_genre, id_order, label, date_ranges, description, text_color, background_color, roles } = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const range of date_ranges) {
            // insert the event for this date range
            const [result] = await connection.query(
                `INSERT INTO event
                (id_created_by, id_venue, id_genre, id_order, label, date_from, date_to, description, text_color, background_color, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [id_created_by, id_venue, id_genre, id_order, label, range.date_from, range.date_to, description, text_color, background_color]
            );

            const insertedId = result.insertId;

            // insert roles for this event
            if (roles.length > 0) {
                const placeholders = roles.map(() => '(?, ?, ?, 1)').join(', ');
                const values = roles.flatMap(role => [role.uid, role.rid, insertedId]);
                const sql = `INSERT INTO user_event (id_user, id_role, id_event, active) VALUES ${placeholders}`;
                await connection.query(sql, values);
            }
        }

        await connection.commit();

        return json({ message: 'Event přidán.' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return json({ message: 'Stala se chyba' }, { status: 500 });
    } finally {
        connection.release();
    }
}
