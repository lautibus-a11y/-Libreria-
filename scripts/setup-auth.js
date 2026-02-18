import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function setupAuth() {
    const client = new Client({ connectionString });
    try {
        console.log('--- CONFIGURANDO AUTH & DB ---');
        await client.connect();

        // Leer el script SQL optimizado para Auth
        const sqlPath = path.join(__dirname, '../supabase_auth_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Ejecutar todos los comandos SQL
        await client.query(sql);

        console.log('✅ Base de datos configurada para Auth. Reglas RLS estrictas aplicadas.');

    } catch (err) {
        console.error('Error FATAL configurando Auth DB:', err);
    } finally {
        await client.end();
    }
}

setupAuth();
