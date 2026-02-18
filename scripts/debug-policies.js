import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function checkPolicies() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Verificando políticas RLS en tabla books...');

        const res = await client.query(`
      SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'books';
    `);

        if (res.rows.length === 0) {
            console.log('⚠️ NO se encontraron políticas en la tabla books. (Esto podría significar que está abierta o cerrada por defecto si RLS está activo)');
        } else {
            console.table(res.rows.map(row => ({
                policy: row.policyname,
                roles: row.roles,
                cmd: row.cmd,
                using: row.qual,
                check: row.with_check
            })));
        }

        const rlsRes = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname = 'books';
    `);
        console.log('Estado RLS (relrowsecurity):', rlsRes.rows[0]);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkPolicies();
