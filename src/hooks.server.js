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
        if (pathname.includes('/events') && !user.isAllowedToCreate()) throw redirect(302, '/403'); // Redirect to Forbidden page
    }

    return resolve(event);
}