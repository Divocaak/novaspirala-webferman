import { pool } from "$lib/db/mysql.js";
import { validatePassword } from '$lib/auth';
import { json } from '@sveltejs/kit';
import { User } from "$lib/classes/user.js";

export async function POST({ request, cookies }) {
    const { login, password } = await request.json();

    const [rows] = await pool.query(`
        SELECT id, login, email, pass_hash, phone, f_name, l_name
        FROM user
        WHERE login = ?;`,
        [login]);

    if (rows.length === 0) {
        return json({ message: 'Uživatel neexistuje' }, { status: 401 });
    }

    if (!validatePassword(password, rows[0].pass_hash)) {
        return json({ message: 'Špatné přihlašovací údaje' }, { status: 401 });
    }

    const user = new User({
        id: rows[0].id,
        login: rows[0].login,
        email: rows[0].email,
        fName: rows[0].f_name,
        lName: rows[0].l_name,
        phone: rows[0].phone
    });

    const [prows] = await pool.query(`
        SELECT p.id, p.label
        FROM user_privilege up
        INNER JOIN privilege p ON up.id_privilege=p.id
        WHERE up.id_user = ?
        AND up.active IS TRUE;`,
        [user.id]);
    user.setPrivileges(prows)

    cookies.set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return json({ message: 'Úspěšně přihlášen' });
}
