import { SUBTITLES_ROOT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const subtitlesRoot = path.resolve(SUBTITLES_ROOT);

export async function POST({ request }) {
    try {
        const { fileName, languages } = await request.json();
        console.log(languages);

        if (!fileName || !Array.isArray(languages)) return json({ message: 'Neplatná data.' }, { status: 400 });
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fileName)) return json({ message: 'Neplatný název titulků.' }, { status: 400 });
        if (!languages.length) return json({ message: 'Musíte mít alespoň jeden jazyk.' }, { status: 400 });

        const languageCodes = languages.map(language => language.code);
        if (new Set(languageCodes).size !== languageCodes.length) return json({ message: 'Stejný jazyk nelze přidat vícekrát.' }, { status: 400 });
        for (const language of languages)
            if (!language || typeof language.code !== 'string' || typeof language.text !== 'string' || !/^[a-z]{2}$/.test(language.code)) return json({ message: 'Neplatná data jazyka.' }, { status: 400 });

        const directory = path.join(subtitlesRoot, fileName);
        try {
            await fs.access(directory);
        } catch (error) {
            if (error.code === 'ENOENT') return json({ message: 'Titulky nebyly nalezeny.' }, { status: 404 });
            throw error;
        }

        // Remove existing language files
        const existingFiles = await fs.readdir(directory);
        for (const file of existingFiles) if (file.endsWith('.txt')) await fs.unlink(path.join(directory, file));

        // Write the updated language files
        for (const language of languages) await fs.writeFile(path.join(directory, `${language.code}.txt`), language.text, 'utf8');

        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({ message: 'Nepodařilo se aktualizovat titulky.' }, { status: 500 });
    }
}