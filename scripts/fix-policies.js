import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function fixPolicies() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Actualizando políticas de seguridad...');

        const queries = [
            // Libros
            "DROP POLICY IF EXISTS \"Permitir lectura pública de libros\" ON books",
            "CREATE POLICY \"Acceso total para libros\" ON books FOR ALL USING (true) WITH CHECK (true)",

            // Ajustes
            "DROP POLICY IF EXISTS \"Permitir lectura pública de configuración\" ON settings",
            "CREATE POLICY \"Acceso total para configuración\" ON settings FOR ALL USING (true) WITH CHECK (true)",

            // Pedidos
            "DROP POLICY IF EXISTS \"Permitir lectura pública de pedidos\" ON orders",
            "CREATE POLICY \"Acceso total para pedidos\" ON orders FOR ALL USING (true) WITH CHECK (true)",

            // Reseñas
            "DROP POLICY IF EXISTS \"Permitir lectura pública de reseñas\" ON reviews",
            "CREATE POLICY \"Acceso total para reseñas\" ON reviews FOR ALL USING (true) WITH CHECK (true)"
        ];

        for (const q of queries) {
            await client.query(q);
        }

        console.log('Políticas actualizadas. Ahora la App tiene permiso para escribir.');

    } catch (err) {
        console.error('Error actualizando políticas:', err.message);
    } finally {
        await client.end();
    }
}

fixPolicies();
