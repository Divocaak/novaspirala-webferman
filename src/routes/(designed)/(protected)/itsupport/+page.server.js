export const load = async ({ url, fetch }) => {

  const tasksRes = await fetch("/api/itTasks/getAll");
  const tasksData = await tasksRes.json();

  return { tasks: tasksData }
};