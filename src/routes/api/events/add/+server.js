import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { id_created_by, id_venue, id_genre, id_order, label, date_from, date_to, description, text_color, background_color, roles } = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query("INSERT INTO event (id_created_by, id_venue, id_genre, id_order, label, date_from, date_to, description, text_color, background_color, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [id_created_by, id_venue, id_genre, id_order, label, date_from, date_to, description, text_color, background_color, 1]);

        const insertedId = result.insertId;
        const placeholders = roles.map(() => '(?, ?, ?, 1)').join(', ');
        const values = roles.flatMap(role => [role.uid, role.rid, insertedId]);
        const sql = `INSERT INTO user_event (id_user, id_role, id_event, active) VALUES ${placeholders}`;
        await connection.query(sql, values);

        await connection.commit();

        return json({ message: 'event added successfully.' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return json({ message: 'error occurred while adding the event' }, { status: 500 });
    } finally {
        connection.release();
    }
}
