import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url, params, fetch }) => {

    const user = User.fromJSON(locals.user);
    if (!user.isAllowedToRead()) return { roles: [], events: [] };

    if (!url.searchParams.has('date_from') && !url.searchParams.has('date_to')) {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };

        const nextParams = new URLSearchParams(url.searchParams);
        nextParams.set('date_from', formatDate(from));
        nextParams.set('date_to', formatDate(to));
        throw redirect(307, `${url.pathname}?${nextParams.toString()}`);
    }


    const date_from = url.searchParams.get('date_from');
    const date_to = url.searchParams.get('date_to');
    const id_venue = url.searchParams.get('id_venue');
    const id_genre = url.searchParams.get('id_genre');

    const [rolesRes, eventsRes, venuesRes, genresRes, eventNotificationRes, vacationsRes] = await Promise.all([
        fetch("/api/roles/getAll"),
        fetch(`/api/events/getAll?${new URLSearchParams({ date_from, date_to, id_venue, id_genre })}`),
        fetch("/api/venues/getAllForForm"),
        fetch("/api/genres/getAllForForm"),
        fetch(`/api/users/getAllEventNotifications?${new URLSearchParams({ uid: user.id })}`),
        user.isAllowedToWriteVacation() ? fetch(`/api/vacation/getAll?${new URLSearchParams({ date_from, date_to })}`) : Promise.resolve(null)
    ]);

    const [rolesData, eventsData, venuesData, genresData, eventNotificationData] = await Promise.all([
        rolesRes.json(),
        eventsRes.json(),
        venuesRes.json(),
        genresRes.json(),
        eventNotificationRes.json()
    ]);
    const vacationsData = vacationsRes ? await vacationsRes.json() : [];

    let enrichedEvents = [];
    if (eventsData) {
        enrichedEvents = await Promise.all(
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
    }

    return {
        roles: rolesData,
        events: enrichedEvents,
        venues: venuesData,
        genres: genresData,
        notifications: eventNotificationData,
        vacations: vacationsData
    }
}