import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;

    try {
        const {
            id_created_by,
            id_venue,
            id_genre,
            id_order,
            label,
            date_ranges,
            description,
            text_color,
            background_color,
            roles,
            role_limits,
            notifyUsers
        } = await request.json();

        connection = await pool.getConnection();

        await connection.beginTransaction();

        for (const range of date_ranges) {
            // --------------------------------------------------
            // 1. Create the event
            // --------------------------------------------------

            const [result] = await connection.query(
                `INSERT INTO event
                (
                    id_created_by,
                    id_venue,
                    id_genre,
                    id_order,
                    label,
                    date_from,
                    date_to,
                    description,
                    text_color,
                    background_color,
                    active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [
                    id_created_by,
                    id_venue,
                    id_genre,
                    id_order,
                    label,
                    range.date_from,
                    range.date_to,
                    description,
                    text_color,
                    background_color
                ]
            );

            const insertedId = result.insertId;

            // --------------------------------------------------
            // 2. Save role limits
            // --------------------------------------------------

            if (role_limits) {
                const limits = Object.entries(role_limits)
                    .filter(([, limit]) => limit !== null && limit !== '' && limit !== undefined)
                    .map(([rid, limit]) => [insertedId, Number(rid), Number(limit)]);

                if (limits.length > 0) {
                    const placeholders = limits.map(() => '(?, ?, ?)').join(', ');
                    const values = limits.flat();
                    await connection.query(
                        `INSERT INTO event_role_limit
			            (id_event, id_role, \`limit\`)
			            VALUES ${placeholders}`,
                        values
                    );
                }
            }

            // --------------------------------------------------
            // 2. Get the date of this event
            // --------------------------------------------------

            const eventDate = range.date_from.slice(0, 10);

            // --------------------------------------------------
            // 3. Assign only users selected for this date
            // --------------------------------------------------

            const eventRoles = roles.filter(
                (role) => role.date === eventDate
            );

            if (eventRoles.length > 0) {
                const placeholders = eventRoles
                    .map(() => '(?, ?, ?, ?, 1)')
                    .join(', ');

                const values = eventRoles.flatMap((role) => [
                    role.uid,
                    role.rid,
                    insertedId,
                    role.note
                ]);

                await connection.query(
                    `INSERT INTO user_event
                    (id_user, id_role, id_event, comment, active)
                    VALUES ${placeholders}`,
                    values
                );
            }

            // --------------------------------------------------
            // 4. Notifications belong to this event
            // --------------------------------------------------

            if (notifyUsers?.length > 0) {
                const placeholders = notifyUsers
                    .map(() => '(?, ?, ?)')
                    .join(', ');

                const values = notifyUsers.flatMap((user) => [
                    insertedId,
                    user.id,
                    'created'
                ]);

                await connection.query(
                    `INSERT INTO event_notification
                    (id_event, id_user_recipient, type)
                    VALUES ${placeholders}`,
                    values
                );
            }
        }

        await connection.commit();

        return json(
            { message: 'Event přidán.' },
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