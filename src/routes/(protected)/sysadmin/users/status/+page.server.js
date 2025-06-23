// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const uid = url.searchParams.get('uid');
  const sid = url.searchParams.get('sid');

  const result = await fetch(`/api/statuses/getAll`);
  const data = await result.json();

  return { uid: uid, sid: sid, statuses: data };
}