import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {


    const eid = url.searchParams.get("id");

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
		LIMIT 1;`, eid)
        .then(([rows, fields]) => result = rows[0]);

    // Fetch assigned users by role
    const [assignedRoles] = await pool.query(`
        SELECT ur.id_user AS uid, ur.id_role AS rid
        FROM user_event ur
        INNER JOIN user u ON ur.id_user = u.id
        INNER JOIN role r ON ur.id_role = r.id
        WHERE ur.id_event = ? AND ur.active IS TRUE
        `, eid);

    return new Response(JSON.stringify({
        ...result,
        assignedRoles
    }));
}
