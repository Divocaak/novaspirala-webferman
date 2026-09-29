export async function load({ url, fetch }) {
    const id = url.searchParams.get('id');
    if (!id) return;

    const res = await fetch(`/api/subtitles/get?id=${encodeURIComponent(id)}`);
    if (!res.ok) {
        const data = await res.json();
        return { error: data.message };
    }

    const subtitle = await res.json();
    return { subtitle };
}