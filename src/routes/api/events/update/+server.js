import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;

    try {
        const {
            id,
            id_venue,
            id_genre,
            id_order,
            label,
            date_ranges,
            description,
            text_color,
            background_color,
            roles,
            notifyUsers
        } = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // --------------------------------------------------
        // Update event
        // --------------------------------------------------

        const range = date_ranges?.[0];

        if (!range?.date_from || !range?.date_to) {
            throw new Error('Event musí obsahovat datum.');
        }

        await connection.query(
            `UPDATE event
			 SET
				id_venue = ?,
				id_genre = ?,
				id_order = ?,
				label = ?,
				date_from = ?,
				date_to = ?,
				description = ?,
				text_color = ?,
				background_color = ?
			 WHERE id = ?`,
            [
                id_venue,
                id_genre,
                id_order,
                label,
                range.date_from,
                range.date_to,
                description,
                text_color,
                background_color,
                id
            ]
        );

        // --------------------------------------------------
        // Deactivate existing user assignments
        // --------------------------------------------------

        await connection.query(
            `UPDATE user_event
			 SET active = 0
			 WHERE id_event = ?`,
            [id]
        );

        // --------------------------------------------------
        // Save current user assignments
        // --------------------------------------------------

        if (roles?.length > 0) {
            const placeholders = roles.map(() => '(?, ?, ?, ?, 1)').join(', ');

            const values = roles.flatMap((role) => [
                role.uid,
                role.rid,
                id,
                role.note ?? ''
            ]);

            await connection.query(
                `INSERT INTO user_event
					(id_user, id_role, id_event, comment, active)
				 VALUES ${placeholders}
				 ON DUPLICATE KEY UPDATE
					active = VALUES(active),
					comment = VALUES(comment)`,
                values
            );
        }

        // --------------------------------------------------
        // Save notifications
        // --------------------------------------------------

        if (notifyUsers?.length > 0) {
            const placeholders = notifyUsers.map(() => '(?, ?, ?)').join(', ');

            const values = notifyUsers.flatMap((user) => [
                id,
                user.id,
                'updated'
            ]);

            await connection.query(
                `INSERT INTO event_notification
					(id_event, id_user_recipient, type)
				 VALUES ${placeholders}`,
                values
            );
        }

        await connection.commit();

        return json(
            { message: 'Event upraven' },
            { status: 200 }
        );
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