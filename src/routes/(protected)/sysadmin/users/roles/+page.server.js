export const load = async ({ url, params, fetch }) => {

  const uid = url.searchParams.get('uid');
  
  const rolesResult = await fetch(`/api/roles/getAll`);
  const rolesData = await rolesResult.json();
  
  const userRolesResult = await fetch(`/api/userRoles/get?uid=${uid}`);
  const userRolesData = await userRolesResult.json();

  return { uid: uid, roles: rolesData, userRoles: userRolesData };
}