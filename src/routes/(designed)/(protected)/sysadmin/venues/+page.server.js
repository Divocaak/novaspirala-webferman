export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/venues/getAll");
    const data = await result.json();

    return {
        venues: data
    }
}