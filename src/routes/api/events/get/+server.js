import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    let result;
    await pool.query(`
		SELECT e.id, e.id_order, e.label, e.date_from, e.date_to, e.description, e.text_color, e.background_color,
		u.id AS id_created_by,
		v.id AS id_venue,
		g.id AS id_genre
		FROM event e
		INNER JOIN user u ON e.id_created_by = u.id
		INNER JOIN venue v ON e.id_venue = v.id
		INNER JOIN genre g ON e.id_genre = g.id
		WHERE e.id = ? AND e.active IS TRUE
		LIMIT 1;`, url.searchParams.get("id"))
        .then(([rows, fields]) => result = rows[0]);

    // Fetch assigned users by role
    /* const [assignedRoles] = await connection.query(`
            SELECT ur.id_user AS uid, ur.id_role AS rid,
                   u.f_name, u.l_name, u.id,
                   r.label, r.note, r.text_color, r.background_color
            FROM user_event ur
            INNER JOIN user u ON ur.id_user = u.id
            INNER JOIN role r ON ur.id_role = r.id
            WHERE ur.id_event = ? AND ur.active IS TRUE
        `, [id]); */
    /* 
        return json({
            event: {
                id: event.id,
                id_order: event.id_order,
                label: event.label,
                date_from: event.date_from,
                date_to: event.date_to,
                description: event.description,
                text_color: event.text_color,
                background_color: event.background_color,
                id_created_by: {
                    id: event.created_by_id,
                    login: event.login,
                    email: event.email,
                    phone: event.phone,
                    f_name: event.f_name,
                    l_name: event.l_name
                },
                id_venue: {
                    id: event.venue_id,
                    label: event.venue_label
                },
                id_genre: {
                    id: event.genre_id,
                    label: event.genre_label
                }
            },
            assignedRoles
        }); */

    return new Response(JSON.stringify(result));
}
