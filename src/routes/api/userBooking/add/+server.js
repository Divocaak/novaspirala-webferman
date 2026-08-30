import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;

    try {
        const { eid, uid, selectedRoles } = await request.json();

        if (!eid || !uid || !selectedRoles || typeof selectedRoles !== 'object') {
            return json({ message: 'Neplatná data.' }, { status: 400 });
        }

        const rolesToBook = Object.entries(selectedRoles)
            .filter(([, selected]) => selected === true)
            .map(([roleId]) => Number(roleId))
            .filter(Number.isInteger);

        if (rolesToBook.length === 0) {
            return json({ message: 'Nebyla vybrána žádná role.' }, { status: 400 });
        }

        connection = await pool.getConnection();

        await connection.beginTransaction();

        const bookedAt = new Date().toLocaleString('sv-SE', {
            timeZone: 'Europe/Prague'
        })

        const placeholders = rolesToBook
            .map(() => '(?, ?, ?, ?)')
            .join(', ');

        const values = rolesToBook.flatMap((roleId) => [
            uid,
            roleId,
            eid,
            bookedAt
        ]);

        const sql = `
			INSERT INTO user_event
				(id_user, id_role, id_event, booked)
			VALUES ${placeholders}
			ON DUPLICATE KEY UPDATE
				booked = VALUES(booked)
		`;

        await connection.query(sql, values);

        await connection.commit();

        return json({ message: 'Event upraven' }, { status: 200 });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error(error);

        return json(
            { message: 'Stala se chyba' },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}