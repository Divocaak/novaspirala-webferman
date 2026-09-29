import { PUBLIC_ROLE_SUBTITLES_ID } from '$env/static/public';
import { SUBTITLES_ROOT } from '$env/static/private';

import { pool } from '$lib/db/mysql.js';

import fs from 'fs/promises';
import path from 'path';

const subtitlesRoot = path.resolve(SUBTITLES_ROOT);

export async function GET({ url }) {
    const date_from = url.searchParams.get('date_from');
    const date_to = url.searchParams.get('date_to');

    const params = [PUBLIC_ROLE_SUBTITLES_ID, date_from, date_to
    ];

    const [rows] = await pool.query(`
        SELECT e.id, e.label, e.date_from, e.date_to, e.subtitles_name,
        u.id AS operatorId, u.login, u.email, u.phone, u.f_name, u.l_name
        FROM event e
        INNER JOIN user_event ue ON ue.id_event = e.id
        INNER JOIN user u ON ue.id_user = u.id
        WHERE
            e.subtitles_name IS NOT NULL
            AND ue.id_role = ?
            AND ue.active IS TRUE
            AND e.active IS TRUE
            AND e.date_to >= ?
            AND e.date_from <= ?
    `, params);

    const languagesCache = new Map();

    const events = await Promise.all(
        rows.map(async (event) => {
            if (!languagesCache.has(event.subtitles_name)) {
                const directory = path.join(subtitlesRoot, event.subtitles_name);

                try {
                    const files = await fs.readdir(directory);

                    const languages = files
                        .filter(file => file.endsWith('.txt'))
                        .map(file => file.slice(0, -4))
                        .sort((a, b) => a.localeCompare(b));

                    languagesCache.set(event.subtitles_name, languages);
                } catch (error) {
                    if (error.code === 'ENOENT') languagesCache.set(event.subtitles_name, []);
                    else throw error;
                }
            }

            return { ...event, languages: languagesCache.get(event.subtitles_name) };
        })
    );

    return Response.json(events);
}