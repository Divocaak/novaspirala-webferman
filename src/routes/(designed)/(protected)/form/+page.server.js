export const load = async ({ url, fetch }) => {

  const eid = url.searchParams.get('id');

  const [usersAllowedRes, venuesRes, genresRes, rolesRes, commentsRes] = await Promise.all([
    fetch("/api/users/getAllAllowedToWrite"),
    fetch("/api/venues/getAllForForm"),
    fetch("/api/genres/getAllForForm"),
    fetch("/api/roles/getAll"),
    fetch(`/api/comments/getAllInEvent?eid=${eid}`)
  ]);

  const [usersAllowedData, venuesData, genresData, rolesData, commentsData] = await Promise.all([
    usersAllowedRes.json(),
    venuesRes.json(),
    genresRes.json(),
    rolesRes.json(),
    commentsRes.json()
  ]);

  const usersAllowedToWrite = usersAllowedData.map(user => ({
    id: user.id,
    label: `${user.l_name} ${user.f_name} (${user.login})`
  }));

  const bookedUsersRes = await fetch(`/api/userBooking/getAll?eid=${eid}`);
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
            b => b.rid === role.id && b.uid === user.id
          )
        })),
        comments: commentsData?.[role.id] ?? []
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