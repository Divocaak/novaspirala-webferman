import { pool } from '$lib/db/mysql.js';
import { hashPassword } from '$lib/auth';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    let connection;
    try {
        const { login, password, email, phone, fName, lName } = await request.json();

        if (!login || !password) {
            return json({ message: 'Login a heslo jsou povinné položky' }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if the username is already taken
        const [existingUser] = await pool.query('SELECT id FROM user WHERE login = ?', [login]);
        if (existingUser.length > 0) {
            return json({ message: 'Uživatel již existuje' }, { status: 409 });
        }

        // Insert the new user into the database
        const passwordHash = hashPassword(password);
        const [result] = await connection.query('INSERT INTO user (login, pass_hash, email, phone, f_name, l_name) VALUES (?, ?, ?, ?, ?, ?)',
            [login, passwordHash, email, (phone ? parseInt(phone) : null), fName, lName]
        );

        await connection.commit();

        return json({ message: 'Registrace proběhla úspěšně.' }, { status: 201 });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return json({ message: 'Stala se chyba.' }, { status: 500 });
    } finally {
        connection.release();
    }
}
