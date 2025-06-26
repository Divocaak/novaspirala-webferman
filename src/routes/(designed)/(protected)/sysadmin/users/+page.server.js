export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/users/getAll");
    const data = await result.json();

    return {
        users: data
    }
}