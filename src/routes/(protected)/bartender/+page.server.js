// @ts-nocheck
import { PUBLIC_PRIVILEGE_ID_BARTENDER } from '$env/static/public';

// @ts-nocheck
export const load = async ({ url, params, fetch, locals }) => {

    const response = await fetch("/api/structures/getUserManaged", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: locals.user.id, pid: PUBLIC_PRIVILEGE_ID_BARTENDER })
    });
    const result = await response.json();

    return {
        structures: result
    }
}