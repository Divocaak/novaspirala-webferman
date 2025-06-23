export const load = async ({ params, fetch }) => {

    const result = await fetch(`/api/products/getAll?sid=${params.sid}`);
    const data = await result.json();

    return {
        products: data
    }
}