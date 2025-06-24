export const load = async ({ url, params, fetch }) => {

  const uid = url.searchParams.get('uid');
  
  const privilegesResult = await fetch(`/api/privileges/getAll`);
  const privilegesData = await privilegesResult.json();
  
  const userPrivilegesResult = await fetch(`/api/userPrivileges/get?uid=${uid}`);
  const userPrivilegesData = await userPrivilegesResult.json();

  return { uid: uid, privileges: privilegesData, userPrivileges: userPrivilegesData };
}