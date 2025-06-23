// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

    const sid = url.searchParams.get('sid');
    const usersResponse = await fetch("/api/structures/getUsers", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sid: sid })
    });
    const usersResult = await usersResponse.json();

    return {
        sid: sid,
        users: usersResult
    }
}