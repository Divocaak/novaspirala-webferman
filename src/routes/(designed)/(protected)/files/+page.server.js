export const load = async ({ url, fetch }) => {
  const eid = url.searchParams.get('id');
  if (!eid) return { eid: null, files: [] };

  const res = await fetch(`/api/events/files/getAll?eid=${eid}`);
  if (!res.ok) return { eid, files: [] };

  const files = await res.json();
  return { eid, files };
};