// @ts-nocheck
import { User } from '$lib/classes/user.js';

export async function load({ locals }) {
    return { user: locals.user };
}
