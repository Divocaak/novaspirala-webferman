export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/events/getAll");
    const data = await result.json();

    return {
        events: data
    }
}