import { SUBTITLES_ROOT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const subtitlesRoot = path.resolve(SUBTITLES_ROOT);

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    if (!id) return json({ message: 'Chybí ID titulků.' }, { status: 400 });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return json({ message: 'Neplatné ID titulků.' }, { status: 400 });

    const directory = path.join(subtitlesRoot, id);
    try {
        const files = await fs.readdir(directory);
        const languages = [];

        for (const file of files) {
            if (!file.endsWith('.txt')) continue;
            const code = file.slice(0, -4);
            const text = await fs.readFile(path.join(directory, file), 'utf8');
            languages.push({ code, text });
        }

        languages.sort((a, b) => a.code.localeCompare(b.code));

        return json({ fileName: id, languages });
    } catch (error) {
        if (error.code === 'ENOENT') return json({ message: 'Titulky nebyly nalezeny.' }, { status: 404 });
        console.error(error);
        return json({ message: 'Nepodařilo se načíst titulky.' }, { status: 500 });
    }
}