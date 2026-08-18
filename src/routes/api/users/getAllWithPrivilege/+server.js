import { pool } from "$lib/db/mysql.js";

export async function GET({url}) {
    const privilegeIds = url.searchParams.get('privilegeIds')?.split(',').filter(Boolean);
    const placeholders = privilegeIds.map(() => '?').join(', ');

    const [rows] = await pool.query(
        `SELECT DISTINCT u.id, u.login, u.f_name, u.l_name
		FROM user_privilege up
		INNER JOIN user u ON up.id_user = u.id
		WHERE up.id_privilege IN (${placeholders})
		AND up.active IS TRUE;`,
        privilegeIds
    );

    return new Response(JSON.stringify(rows));
}