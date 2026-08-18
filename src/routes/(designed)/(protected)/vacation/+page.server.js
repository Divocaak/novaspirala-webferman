export const load = async ({ url, fetch }) => {

  const vacationRes = await fetch("/api/vacation/getAll");
  const vacationData = await vacationRes.json();

  return { vacations: vacationData }
};