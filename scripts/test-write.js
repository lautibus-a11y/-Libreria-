import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:DxOdFxHDvgNTZ2gS@db.ujonhicdxuyblwlxhmnr.supabase.co:5432/postgres";

async function testWrite() {
    const client = new Client({ connectionString });
    try {
        await client.connect();

        // Insertar un libro de prueba
        const res = await client.query(`
      INSERT INTO books (title, author, price, description, category, stock)
      VALUES ('TEST PERSISTENCIA', 'Test Author', 9.99, 'Libro de prueba', 'Test', 1)
      RETURNING id, title
    `);
        console.log('✅ Libro insertado:', res.rows[0]);

        // Verificar que existe
        const check = await client.query(`SELECT id, title FROM books WHERE title = 'TEST PERSISTENCIA'`);
        console.log('✅ Verificación:', check.rows[0]);

        // Limpiar
        await client.query(`DELETE FROM books WHERE title = 'TEST PERSISTENCIA'`);
        console.log('✅ Libro de prueba eliminado. La DB funciona correctamente.');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

testWrite();
