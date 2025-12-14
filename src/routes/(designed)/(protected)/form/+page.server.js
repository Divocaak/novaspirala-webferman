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

  const eid = url.searchParams.get('id');

  /* TODO api ednpoint */
  /* need rid and uid pairs */
  const bookedUsersRes = await fetch(`/api/users/booking/getAll?eid=${eid}`);
  const bookedUsers = await bookedUsersRes.json()

  const roles = await Promise.all(
    rolesData.map(async role => {
      const res = await fetch(`/api/users/getAllWithRole?rid=${role.id}`);
      const users = await res.json();

      return {
        role,
        users: users.map(user => ({
          id: user.id,
          label: `${user.l_name} ${user.f_name} (${user.login})`,
          booked: bookedUsers.some(
            b => b.roleid === role.id && b.userid === user.id
          )
        }))
      };
    })
  );

  const event = eid
    ? await fetch(`/api/events/get?id=${eid}`).then(res => res.json())
    : null;

  return {
    event,
    usersAllowedToWrite,
    venues: venuesData,
    genres: genresData,
    roles
  };
};

/* const [assignedRoles] = await pool.query(`
        SELECT ur.id_user AS uid, ur.id_role AS rid
        FROM user_event ur
        INNER JOIN user u ON ur.id_user = u.id
        INNER JOIN role r ON ur.id_role = r.id
        WHERE ur.id_event = ? AND ur.active IS TRUE
        `, eid); */