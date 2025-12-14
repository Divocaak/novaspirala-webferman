import { pool } from "$lib/db/mysql.js";
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { id, uid, selectedRoles } = await request.json();
        if (selectedRoles.length < 1) return;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const entries = Object.entries(selectedRoles);
        const placeholders = entries
            .filter(([, roleValue]) => roleValue === true)
            .map(() => '(?, ?, ?, ?)')
            .join(', ');
        const values = entries.flatMap(
            ([roleKey, roleValue]) =>
                roleValue === true ? [uid, Number(roleKey), id, roleValue] : []
        );

        const sql = `
                INSERT INTO user_event (id_user, id_role, id_event, booked)
                VALUES ${placeholders}
                ON DUPLICATE KEY UPDATE booked = VALUES(booked)
            `;
        await connection.query(sql, values);

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
