import { pool } from "$lib/db/mysql.js";

export async function GET({ request, params, url }) {

    const eid = url.searchParams.get("eid");
    const uid = url.searchParams.get("uid");
    
    const [bookedRoles] = await pool.query(`
        SELECT ur.id_role AS rid
        FROM user_event ur 
        WHERE ur.id_event = ? AND ur.id_user = ? AND ur.booked IS TRUE
        `, [eid, uid]);

    return new Response(JSON.stringify(bookedRoles));
}
