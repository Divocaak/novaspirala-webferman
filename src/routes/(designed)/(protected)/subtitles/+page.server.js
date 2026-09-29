export const load = async ({ url, fetch, params }) => {

    const date_from = url.searchParams.get('date_from');
    const date_to = url.searchParams.get('date_to');

    const eventSubtitlesRes = await fetch(`/api/eventSubtitles/getAll?${new URLSearchParams({ date_from, date_to })}`);
    const eventSubtitlesData = await eventSubtitlesRes.json();

    return { eventsWithSubtitles: eventSubtitlesData }
};