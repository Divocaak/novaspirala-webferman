import { SUBTITLES_ROOT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const subtitlesRoot = path.resolve(SUBTITLES_ROOT);

export async function POST({ request }) {
    try {
        const { fileName, languages } = await request.json();

        // Basic validation
        if (!fileName || !Array.isArray(languages)) return json({ message: 'Neplatná data.' }, { status: 400 });
        if (!languages.length) return json({ message: 'Musíte přidat alespoň jeden jazyk.' }, { status: 400 });

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fileName)) return json({ message: 'Neplatný název titulků.' }, { status: 400 });

        // Validate languages
        for (const language of languages) {
            if (!language || typeof language.code !== 'string' || typeof language.text !== 'string') return json({ message: 'Neplatná data jazyka.' }, { status: 400 });
            if (!/^[a-z]{2}$/.test(language.code)) return json({ message: `Neplatný jazyk: ${language.code}` }, { status: 400 });
        }

        // Prevent duplicate languages
        const languageCodes = languages.map(language => language.code);
        if (new Set(languageCodes).size !== languageCodes.length) return json({ message: 'Stejný jazyk nelze přidat vícekrát.' }, { status: 400 });

        const directory = path.join(subtitlesRoot, fileName);

        // Check if subtitle already exists
        try {
            await fs.access(directory);
            return json({ message: `Titulky s názvem "${fileName}" již existují.` }, { status: 409 });
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }

        // Create subtitle directory
        await fs.mkdir(directory, { recursive: true });

        // Create language files
        for (const language of languages) {
            const filePath = path.join(directory, `${language.code}.txt`);
            await fs.writeFile(filePath, language.text, 'utf8');
        }

        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({ message: 'Nepodařilo se uložit titulky.' }, { status: 500 });
    }
}