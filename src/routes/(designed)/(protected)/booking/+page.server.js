import { User } from '$lib/classes/user';

export const load = async ({ url, fetch, locals }) => {
  const user = User.fromJSON(locals.user);

  const date_from = url.searchParams.get('date_from');
  const date_to = url.searchParams.get('date_to');

  const eventsRes = await fetch(`/api/bookingPage/getAll?${new URLSearchParams({ date_from, date_to })}`);
  const eventsData = await eventsRes.json();
  const eventIds = eventsData.map((event) => event.id);

  const userRolesResult = await fetch(`/api/userRoles/getManagingRoles?uid=${user.id}`);
  const userRolesData = await userRolesResult.json();
  const roleIds = userRolesData.map((role) => role.id);

  let bookings = [];
  let roleLimits = [];

  if (eventIds.length > 0 && roleIds.length > 0) {
    const [bookingsRes, roleLimitsRes] = await Promise.all([
      fetch(
        `/api/bookingPage/getBookings?${new URLSearchParams({
          event_ids: eventIds.join(','),
          role_ids: roleIds.join(',')
        })}`
      ),

      fetch(
        `/api/roleLimits/getForBookingPage?${new URLSearchParams({
          event_ids: eventIds.join(','),
          role_ids: roleIds.join(',')
        })}`
      )
    ]);

    bookings = await bookingsRes.json();
    roleLimits = await roleLimitsRes.json();
  }

  return {
    events: eventsData,
    userRoles: userRolesData,
    bookings,
    roleLimits
  };
};