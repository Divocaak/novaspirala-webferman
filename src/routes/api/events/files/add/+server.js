import { pool } from "$lib/db/mysql.js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST({ request, locals }) {
    const formData = await request.formData();

    const eid = formData.get("eid");
    const files = formData.getAll("files");

    const user = locals.user;

    const dir = path.join("dynamic", String(eid));
    await mkdir(dir, { recursive: true });

    for (const file of files) {
        if (!file || file.size === 0) continue;
        if (!["image/jpeg", "application/pdf", "image/png"].includes(file.type)) throw new Error("Nepodporovaný typ");

        const buffer = Buffer.from(await file.arrayBuffer());

        const ext = file.name.split(".").pop();
        const randomName = `${crypto.randomUUID()}.${ext}`;

        await writeFile(path.join(dir, randomName), buffer);

        await pool.query(
            `INSERT INTO event_files 
			(id_event, file_name, original_name, mime_type, id_created_by)
			VALUES (?, ?, ?, ?, ?)`,
            [eid, randomName, file.name, file.type, user.id]
        );
    }

    return new Response(JSON.stringify({ ok: true }));
}