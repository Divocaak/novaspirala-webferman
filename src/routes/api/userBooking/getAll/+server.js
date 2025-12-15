import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    const eid = url.searchParams.get("eid");
    
    const [bookedUsers] = await pool.query(`
        SELECT ur.id_user AS uid, ur.id_role AS rid
        FROM user_event ur 
        WHERE ur.id_event = ? AND ur.booked IS TRUE
        `, eid);

    return new Response(JSON.stringify(bookedUsers));
}
