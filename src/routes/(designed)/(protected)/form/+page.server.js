import { PUBLIC_PRIVILEGE_ID_RECEIVE_NOTIFICATIONS, PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_WRITE } from '$env/static/public';
import { User } from '$lib/classes/user.js';

export const load = async ({ url, fetch, locals }) => {

  const user = User.fromJSON(locals.user);

  const eid = url.searchParams.get('id');

  const [usersAllowedRes, venuesRes, genresRes, rolesRes, commentsRes, usersAllowedToReceiveNotificationsRes] = await Promise.all([
    // get all users allowed to write
    fetch(`/api/users/getAllWithPrivilege?privilegeIds=${[PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_WRITE].join(",")}`),
    fetch("/api/venues/getAllForForm"),
    fetch("/api/genres/getAllForForm"),
    fetch("/api/roles/getAll"),
    fetch(`/api/comments/getAllInEvent?eid=${eid}`),
    // get all users allowed to receive notifications
    fetch(`/api/users/getAllWithPrivilege?privilegeIds=${[PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_RECEIVE_NOTIFICATIONS].join(",")}`),
  ]);

  const [usersAllowedData, venuesData, genresData, rolesData, commentsData, usersAllowedToReceiveNotificationsData] = await Promise.all([
    usersAllowedRes.json(),
    venuesRes.json(),
    genresRes.json(),
    rolesRes.json(),
    commentsRes.json(),
    usersAllowedToReceiveNotificationsRes.json()
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
        users: users.map(user => {
          const booking = bookedUsers.find(b => b.rid === role.id && b.uid === user.id);

          return {
            id: user.id,
            label: `${user.l_name} ${user.f_name} (${user.login})`,
            booked: booking?.booked ?? null
          };
        }),
        comments: commentsData?.[role.id] ?? []
      };
    })
  );

  const event = eid
    ? await fetch(`/api/events/get?id=${eid}`).then(res => res.json())
    : null;

  const usersAllowedToReceiveNotifications = usersAllowedToReceiveNotificationsData.map(user => ({
    id: user.id,
    label: `${user.l_name} ${user.f_name} (${user.login})`
  }));

  let vacations = [];
  if (user.isAllowedToWriteVacation()) {
    const vacationsRes = await fetch('/api/vacation/getAll');
    vacations = await vacationsRes.json();
  }

  return {
    event,
    usersAllowedToWrite,
    venues: venuesData,
    genres: genresData,
    roles,
    usersAllowedToReceiveNotifications,
    vacations
  };
};