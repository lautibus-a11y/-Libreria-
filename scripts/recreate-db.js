import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function recreateDatabase() {
    const client = new Client({ connectionString });
    try {
        console.log('--- RECREANDO BASE DE DATOS ---');
        await client.connect();

        // Leer el script SQL
        const sqlPath = path.join(__dirname, '../supabase_clean_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Ejecutar todos los comandos SQL
        await client.query(sql);

        console.log('✅ Base de datos reconstruida y limpia. Datos persistentes listos para Vercel.');

    } catch (err) {
        console.error('Error FATAL rehaciendo la base de datos:', err);
    } finally {
        await client.end();
    }
}

recreateDatabase();
