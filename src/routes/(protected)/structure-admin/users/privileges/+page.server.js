// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const sid = url.searchParams.get('sid');
  const uid = url.searchParams.get('uid');

  const privilegesResilt = await fetch(`/api/privileges/getAll`);
  const privilegesData = await privilegesResilt.json();

  /* NOTE has to be POST */
  const userPrivilegesResult = await fetch(`/api/userPrivileges/getInStructure?uid=${uid}&sid=${sid}`);
  const userPrivilegesData = await userPrivilegesResult.json();

  return { sid: sid, uid: uid, privileges: privilegesData, userPrivileges: userPrivilegesData };
}