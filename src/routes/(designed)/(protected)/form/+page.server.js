export const load = async ({ url, fetch }) => {
  const [usersAllowedRes, venuesRes, genresRes, rolesRes] = await Promise.all([
    fetch("/api/users/getAllAllowedToWrite"),
    fetch("/api/venues/getAllForForm"),
    fetch("/api/genres/getAllForForm"),
    fetch("/api/roles/getAll")
  ]);

  const [usersAllowedData, venuesData, genresData, rolesData] = await Promise.all([
    usersAllowedRes.json(),
    venuesRes.json(),
    genresRes.json(),
    rolesRes.json()
  ]);

  const usersAllowedToWrite = usersAllowedData.map(user => ({
    id: user.id,
    label: `${user.l_name} ${user.f_name} (${user.login})`
  }));

  const roles = await Promise.all(
    rolesData.map(async role => {
      const res = await fetch(`/api/users/getAllWithRole?rid=${role.id}`);
      const users = await res.json();

      return {
        role,
        users: users.map(user => ({
          id: user.id,
          label: `${user.l_name} ${user.f_name} (${user.login})`
        }))
      };
    })
  );

  const id = url.searchParams.get('id');
  const event = id
    ? await fetch(`/api/events/get?id=${id}`).then(res => res.json())
    : null;

  return {
    event,
    usersAllowedToWrite,
    venues: venuesData,
    genres: genresData,
    roles
  };
};
