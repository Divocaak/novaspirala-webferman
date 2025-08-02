import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const session = event.cookies.get('session');

    if (session) {
        event.locals.user = JSON.parse(session);
    } else {
        event.locals.user = null;
    }

    const pathname = event.route?.id ?? event.url.pathname;

    if (pathname == "/") throw redirect(302, !event.locals.user ? '/login' : "/home");

    if (pathname.startsWith('/(designed)/(protected)')) {
        if (!event.locals.user) {
            throw redirect(302, '/login');
        }

        const user = User.fromJSON(event.locals.user);

        // Restrict access to /sysadmin for non-sysadmins
        if (pathname.includes('/sysadmin') && !user.isSysAdmin()) throw redirect(302, '/403'); // Redirect to Forbidden page
        if (pathname.includes('/form')) {
            if (!user.isAllowedToCreate()) throw redirect(302, '/403'); // Redirect to Forbidden page

            /* BUG make sure user with privilege to create events cannot enter edit form for event not created by him */
            /* const searchParams = event.url.searchParams;
            const eid = searchParams.get('id');
            if (pathname.includes("/form") && eid && !user.isAllowedToEdit(eid)) throw redirect(302, '/403'); */
        }
    }

    return resolve(event);
}