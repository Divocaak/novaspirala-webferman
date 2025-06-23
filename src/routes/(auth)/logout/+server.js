// @ts-nocheck
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, locals }) {
    cookies.delete('session', { path: '/' });
    throw redirect(302, '/');
}
