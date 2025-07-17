export const load = async ({ params, fetch }) => {

    const eventsResult = await fetch("/api/events/getAll");
    const eventsData = await eventsResult.json();

    const rolesResult = await fetch("/api/roles/getAll");
    const rolesData = await rolesResult.json();

    return {
        events: eventsData,
        roles: rolesData
    }
}