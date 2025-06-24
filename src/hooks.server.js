import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const session = event.cookies.get('session');

    if (session) {
        event.locals.user = JSON.parse(session);
    } else {
        event.locals.user = null;
    }

    const pathname = event.url.pathname;

    if (pathname == "/") throw redirect(302, !event.locals.user ? '/login' : "/home");

    if (pathname.startsWith('/(auth)')) return resolve(event);

    if (pathname.startsWith('/(protected)')) {
        if (!event.locals.user) {
            throw redirect(302, '/login');
        }

        const user = User.fromJSON(event.locals.user);
        if (user.isNeutral()) throw redirect(302, "/401"); // Unathorized
        if (user.isBanned() || user.isDeleted()) throw redirect(302, "/403"); // Forbidden

        // Restrict access to /sysadmin for non-sysadmins
        if (pathname.includes('/sysadmin') && !user.isSysAdmin()) throw redirect(302, '/403'); // Redirect to Forbidden page
        if (pathname.includes('/structure-admin') && !user.isStructureAdmin()) throw redirect(302, '/403'); // Redirect to Forbidden page
        if (pathname.includes('/bartender') && !user.isBartender()) throw redirect(302, '/403'); // Redirect to Forbidden page
    }
    /* 
        if (pathname == "/") {
            throw redirect(302, '/(protected)/home');
        } else {
            throw redirect(302, '/(auth)/login');
        } */

    return resolve(event);
}