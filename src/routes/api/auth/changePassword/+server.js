import { pool } from '$lib/db/mysql.js';
import { validatePassword, hashPassword } from '$lib/auth';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { uid, currentPassword, password } = await request.json();

        if (!currentPassword || !password) {
            return json({ message: 'required old and new passwords' }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if the user exists
        const [rows] = await pool.query('SELECT id, pass_hash FROM user WHERE id = ?', [uid]);
        if (rows.length <= 0) {
            return json({ message: 'user not found' }, { status: 409 });
        }

        // check current password
        if (!validatePassword(currentPassword, rows[0].pass_hash)) {
            return json({ message: 'invalid current password' }, { status: 401 });
        }

        // override users password
        const passwordHash = hashPassword(password);
        const [result] = await pool.query("UPDATE user SET pass_hash=? WHERE id=?;", [
            passwordHash,
            uid
        ]);

        await connection.commit();

        return json({ message: 'registered successfully.' }, { status: 201 });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return json({ message: 'error occurred while registering the user.' }, { status: 500 });
    } finally {
        connection.release();
    }
}
