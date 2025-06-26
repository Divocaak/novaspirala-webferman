export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/roles/getAll");
    const data = await result.json();

    return {
        roles: data
    }
}