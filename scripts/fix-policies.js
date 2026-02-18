import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function fixPolicies() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Actualizando políticas de seguridad...');

        const queries = [
            "DROP POLICY IF EXISTS \"Acceso total para libros\" ON books",
            "CREATE POLICY \"Acceso total para libros\" ON books FOR ALL USING (true) WITH CHECK (true)",

            "DROP POLICY IF EXISTS \"Acceso total para configuración\" ON settings",
            "CREATE POLICY \"Acceso total para configuración\" ON settings FOR ALL USING (true) WITH CHECK (true)",

            "DROP POLICY IF EXISTS \"Acceso total para pedidos\" ON orders",
            "CREATE POLICY \"Acceso total para pedidos\" ON orders FOR ALL USING (true) WITH CHECK (true)",

            "DROP POLICY IF EXISTS \"Acceso total para reseñas\" ON reviews",
            "CREATE POLICY \"Acceso total para reseñas\" ON reviews FOR ALL USING (true) WITH CHECK (true)"
        ];

        for (const q of queries) {
            await client.query(q);
        }

        console.log('Políticas actualizadas exitosamente.');

    } catch (err) {
        console.error('Error actualizando políticas:', err.message);
    } finally {
        await client.end();
    }
}

fixPolicies();
