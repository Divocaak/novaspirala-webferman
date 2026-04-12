import { pool } from '$lib/db/mysql.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { id } = await request.json();

    if (!id) return json({ message: 'Chybí ID' }, { status: 400 });

    await pool.query(`
		UPDATE user
		SET deleted = TRUE
		WHERE id = ?`,
        [id]
    );

    return json({ message: 'User deleted' });
}