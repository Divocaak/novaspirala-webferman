import { pool } from '$lib/db/mysql.js';

export async function GET({ url }) {
    const eventIds = (url.searchParams.get('event_ids') ?? '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    const roleIds = (url.searchParams.get('role_ids') ?? '')
        .split(',')
        .map(Number)
        .filter(Boolean);

    if (eventIds.length === 0 || roleIds.length === 0) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

    const eventPlaceholders = eventIds.map(() => '?').join(', ');
    const rolePlaceholders = roleIds.map(() => '?').join(', ');

    const sql = `
        SELECT
            ue.*,
            u.f_name,
            u.l_name
        FROM user_event ue
        JOIN user u ON u.id = ue.id_user
        WHERE ue.id_event IN (${eventPlaceholders})
        AND ue.id_role IN (${rolePlaceholders})
        AND ue.active IS TRUE
    `;

    const values = [...eventIds, ...roleIds];
    const [rows] = await pool.query(sql, values);
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
}