import { User } from '$lib/classes/user';

export const load = async ({ locals, url, params, fetch }) => {

    const user = User.fromJSON(locals.user);
    if (!user.isAllowedToRead()) return { roles: [], events: [] };

    const date_from = url.searchParams.get('date_from');
    const date_to = url.searchParams.get('date_to');
    const id_venue = url.searchParams.get('id_venue');
    const id_genre = url.searchParams.get('id_genre');

    const [rolesRes, eventsRes, venuesRes, genresRes] = await Promise.all([
        fetch("/api/roles/getAll"),
        fetch(`/api/events/getAll?${new URLSearchParams({ date_from, date_to, id_venue, id_genre })}`),
        fetch("/api/venues/getAllForForm"),
        fetch("/api/genres/getAllForForm"),
    ]);

    const [rolesData, eventsData, venuesData, genresData] = await Promise.all([
        rolesRes.json(),
        eventsRes.json(),
        venuesRes.json(),
        genresRes.json()
    ]);

    const enrichedEvents = await Promise.all(
        eventsData.map(async (event) => {
            const usersInEventWithRoleResult = await fetch(`/api/users/getAllInEventWithRole?eid=${event.id}`);
            const usersInEventWithRoleData = await usersInEventWithRoleResult.json();

            return {
                ...event,
                users: usersInEventWithRoleData,
                venues: venuesData,
                genres: genresData
            };
        })
    );

    return {
        roles: rolesData,
        events: enrichedEvents,
        venues: venuesData,
        genres: genresData
    }
}