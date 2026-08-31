import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const eid = url.searchParams.get('eid');

    if (!eid) return json({ message: 'Missing event id' }, { status: 400 });

    try {
        const [rows] = await pool.query(
            `SELECT id_role AS rid, \`limit\`
			 FROM event_role_limit
			 WHERE id_event = ?`,
            [eid]
        );

        return json(rows);
    } catch (error) {
        console.error(error);

        return json(
            { message: 'Stala se chyba' },
            { status: 500 }
        );
    }
}