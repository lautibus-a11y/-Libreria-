import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function fixRLS() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Abriendo RLS para escritura anónima...');

        const queries = [
            // BOOKS: permitir todo a anon y authenticated
            `DROP POLICY IF EXISTS "Public Read Books" ON books`,
            `DROP POLICY IF EXISTS "Admin All Books" ON books`,
            `DROP POLICY IF EXISTS "Auth Insert Books" ON books`,
            `DROP POLICY IF EXISTS "Auth Update Books" ON books`,
            `DROP POLICY IF EXISTS "Auth Delete Books" ON books`,
            `DROP POLICY IF EXISTS "Acceso total para libros" ON books`,
            `CREATE POLICY "anon_all_books" ON books FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)`,

            // SETTINGS: permitir todo a anon y authenticated
            `DROP POLICY IF EXISTS "Public Read Settings" ON settings`,
            `DROP POLICY IF EXISTS "Admin All Settings" ON settings`,
            `DROP POLICY IF EXISTS "Auth All Settings" ON settings`,
            `DROP POLICY IF EXISTS "Acceso total para configuración" ON settings`,
            `CREATE POLICY "anon_all_settings" ON settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)`,

            // ORDERS: permitir todo a anon y authenticated
            `DROP POLICY IF EXISTS "Public Insert Orders" ON orders`,
            `DROP POLICY IF EXISTS "Auth Read Orders" ON orders`,
            `DROP POLICY IF EXISTS "Auth Update Orders" ON orders`,
            `DROP POLICY IF EXISTS "Acceso total para pedidos" ON orders`,
            `CREATE POLICY "anon_all_orders" ON orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)`,

            // REVIEWS: permitir todo a anon y authenticated
            `DROP POLICY IF EXISTS "Public Read Reviews" ON reviews`,
            `DROP POLICY IF EXISTS "Public Insert Reviews" ON reviews`,
            `DROP POLICY IF EXISTS "Auth Delete Reviews" ON reviews`,
            `DROP POLICY IF EXISTS "Acceso total para reseñas" ON reviews`,
            `CREATE POLICY "anon_all_reviews" ON reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)`,
        ];

        for (const q of queries) {
            await client.query(q);
        }

        console.log('✅ RLS abierto correctamente. Ahora la app puede escribir sin autenticación.');

        // Verificar
        const res = await client.query(`SELECT tablename, policyname, roles, cmd FROM pg_policies WHERE tablename IN ('books','settings','orders','reviews') ORDER BY tablename`);
        console.table(res.rows);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

fixRLS();
