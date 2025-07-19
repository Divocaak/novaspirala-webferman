import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result;
    /* URGENT stopped here, edit event */
    await pool.query(`
        SELECT e.id, e.id_order, e.label, e.date_from, e.date_to, e.description, e.text_color AS txtClr, e.background_color AS bgClr,
        u.id AS createdById, u.login, u.email, u.phone, u.f_name, u.l_name,
        v.label AS vLabel, v.addr_label, v.addr_street, v.addr_town, v.addr_postal, v.addr_country_code, v.text_color AS vTxtClr, v.background_color AS vBgClr,
        g.label AS gLabel, g.note, g.text_color AS gTxtClr, g.background_color AS gBgClr
        FROM event e
        INNER JOIN user u ON e.id_created_by = u.id
        INNER JOIN venue v ON e.id_venue = v.id
        INNER JOIN genre g ON e.id_genre = g.id
        WHERE e.id=?;`, url.searchParams.get("id"))
        .then(([rows, fields]) => result = rows[0]);

    return new Response(JSON.stringify(result));
}