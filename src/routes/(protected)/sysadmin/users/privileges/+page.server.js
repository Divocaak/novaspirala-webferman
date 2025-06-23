// @ts-nocheck
export const load = async ({ url, params, fetch }) => {

  const uid = url.searchParams.get('uid');
  const structuresResponse = await fetch("/api/users/getStructures", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid: uid })
  });
  const structuresResult = await structuresResponse.json();

  const privilegesResilt = await fetch(`/api/privileges/getAll`);
  const privilegesData = await privilegesResilt.json();

  const userPrivilegesResult = await fetch(`/api/userPrivileges/getAll?uid=${uid}`);
  const userPrivilegesData = await userPrivilegesResult.json();

  return { uid: uid, structures: structuresResult, privileges: privilegesData, userPrivileges: userPrivilegesData };
}