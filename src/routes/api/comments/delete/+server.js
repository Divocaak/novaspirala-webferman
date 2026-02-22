import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {
    let result;
    await pool.query("DELETE FROM event_role_comment WHERE id=?;", url.searchParams.get("cid"));

    return new Response(JSON.stringify({ status: 200, message: "Komentář odstraněn" }, { status: 200 }));
}