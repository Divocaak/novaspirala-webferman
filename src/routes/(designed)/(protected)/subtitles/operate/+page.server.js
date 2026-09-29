export async function load({ url, fetch }) {
    const sid = url.searchParams.get('sid');
    if (!sid) return;

    const eid = url.searchParams.get('eid');
    if (!eid) return;

    const res = await fetch(`/api/subtitles/get?id=${encodeURIComponent(sid)}`);
    if (!res.ok) {
        const data = await res.json();
        return { error: data.message };
    }

    const subtitle = await res.json();
    return { eid: eid, subtitle };
}