import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const eventIds = url.searchParams.get('event_ids');
    const roleIds = url.searchParams.get('role_ids');

    if (!eventIds || !roleIds) return json([]);

    const eventIdList = eventIds.split(',').map(Number).filter(Number.isInteger);
    const roleIdList = roleIds.split(',').map(Number).filter(Number.isInteger);

    if (eventIdList.length === 0 || roleIdList.length === 0) return json([]);

    const eventPlaceholders = eventIdList.map(() => '?').join(', ');
    const rolePlaceholders = roleIdList.map(() => '?').join(', ');

    try {
        const [rows] = await pool.query(
            `SELECT
				id_event,
				id_role,
				\`limit\`
			FROM event_role_limit
			WHERE id_event IN (${eventPlaceholders})
			AND id_role IN (${rolePlaceholders})`,
            [
                ...eventIdList,
                ...roleIdList
            ]
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