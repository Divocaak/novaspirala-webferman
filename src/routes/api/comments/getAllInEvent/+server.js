import { pool } from "$lib/db/mysql.js";
import { json } from "@sveltejs/kit";

export async function GET({ request, params, url }) {
    const eventId = Number(url.searchParams.get('eid'));

    if (!eventId) {
        return json({ error: 'Missing event id' }, { status: 400 });
    }

    const [rows] = await pool.query(
        ` SELECT erc.id AS cid, erc.id_role AS rid, erc.comment, erc.created,
            u.id AS createdById, u.login, u.email, u.phone, u.f_name, u.l_name
        FROM event_role_comment erc
		JOIN user u
			ON u.id = erc.id_created_by
		WHERE erc.id_event = ?
		ORDER BY erc.id_role ASC, erc.created ASC
		`,
        [eventId]
    );

    const commentsByRole = {};
    for (const row of rows) {
        if (!commentsByRole[row.rid]) {
            commentsByRole[row.rid] = [];
        }

        commentsByRole[row.rid].push({
            id: row.cid,
            comment: row.comment,
            created: row.created,
            user: {
                id: row.createdById,
                login: row.login,
                l_name: row.l_name,
                f_name: row.f_name,
                email: row.email,
                phone: row.phone
            }
        });
    }

    return json(commentsByRole);
}