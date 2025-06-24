export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/genres/getAll");
    const data = await result.json();

    return {
        genres: data
    }
}