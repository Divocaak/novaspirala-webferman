export const load = async ({ url, params, fetch }) => {

  /* URGENT */
  const usersAllowedToWriteResult = await fetch("/api/venues/getAllForForm");
  const usersAllowedToWriteData = await usersAllowedToWriteResult.json();

  const venuesResult = await fetch("/api/venues/getAllForForm");
  const venuesData = await venuesResult.json();

  const genresResult = await fetch("/api/genres/getAllForForm");
  const genresData = await genresResult.json();
  
  const toRet = {
    event: null,
    venues: venuesData,
    genres: genresData
  }

  const id = url.searchParams.get('id');
  if (id) {
    const result = await fetch(`/api/events/get?id=${id}`);
    const data = await result.json();
    toRet.event = data;
  }
  
  return toRet;
}