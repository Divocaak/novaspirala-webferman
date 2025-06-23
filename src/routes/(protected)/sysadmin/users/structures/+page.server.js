// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const uid = url.searchParams.get('uid');
  
  const structuresResult = await fetch(`/api/structures/getAll`);
  const structuresData = await structuresResult.json();
  
  const userStructuresResult = await fetch(`/api/userStructures/get?uid=${uid}`);
  const userStructuresData = await userStructuresResult.json();

  return { uid: uid, structures: structuresData, userStructures: userStructuresData };
}