// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const sid = url.searchParams.get('sid');
  return { sid: sid };
}