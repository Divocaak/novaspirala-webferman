export const load = async ({ url, fetch }) => {

  const subtitlesRes = await fetch("/api/subtitles/getAll");
  const subtitlesData = await subtitlesRes.json();

  return { subtitles: subtitlesData }
};