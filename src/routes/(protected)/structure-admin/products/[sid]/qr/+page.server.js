// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const id = url.searchParams.get('id');
  return { id: id };
}