import { SUBTITLES_ROOT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const subtitlesRoot = path.resolve(SUBTITLES_ROOT);

export async function GET() {
    try {
        const entries = await fs.readdir(subtitlesRoot, { withFileTypes: true });
        const subtitles = [];
        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const directory = path.join(subtitlesRoot, entry.name);
            const files = await fs.readdir(directory);
            const languages = files.filter(file => file.endsWith('.txt')).map(file => file.slice(0, -4));
            subtitles.push({ fileName: entry.name, languages });
        }

        subtitles.sort((a, b) => a.fileName.localeCompare(b.fileName));
        return json(subtitles);
    } catch (error) {
        if (error.code === 'ENOENT') return json([]);
        console.error(error);
        return json({ message: 'Nepodařilo se načíst titulky.' }, { status: 500 });
    }
}