// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const id = url.searchParams.get('id');
  if (id) {
    const result = await fetch(`/api/structures/get?id=${id}`);
    const data = await result.json();
    return { structure: data };
  }
  
  return;
}