import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function check() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM books');
        console.log('--- LIBROS EN SUPABASE ---');
        console.table(res.rows.map(b => ({ id: b.id, title: b.title })));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
check();
