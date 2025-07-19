import { User } from '$lib/classes/user';

export const load = async ({ locals, params, fetch }) => {

    const user = User.fromJSON(locals.user);
    if (!user.isAllowedToRead()) return;

    const rolesResult = await fetch("/api/roles/getAll");
    const rolesData = await rolesResult.json();

    const eventsResult = await fetch("/api/events/getAll");
    const eventsData = await eventsResult.json();

    const enrichedEvents = await Promise.all(
        eventsData.map(async (event) => {
            const usersInEventWithRoleResult = await fetch(`/api/users/getAllInEventWithRole?eid=${event.id}`);
            const usersInEventWithRoleData = await usersInEventWithRoleResult.json();

            return {
                ...event,
                users: usersInEventWithRoleData
            };
        })
    );


    return {
        roles: rolesData,
        events: enrichedEvents
    }
}