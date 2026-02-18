-- Limpieza Total y Configuración de Auth

-- 1. Libros (Público Lectura / Privado Escritura)
DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  category TEXT,
  cover_image TEXT,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID DEFAULT auth.uid() -- Vincula el libro al usuario que lo crea
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;
-- Todo el mundo puede leer
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);
-- Solo usuarios autenticados pueden crear/editar/borrar
CREATE POLICY "Auth Insert Books" ON books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth Update Books" ON books FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Delete Books" ON books FOR DELETE TO authenticated USING (true);

-- 2. Configuración (Público Lectura / Privado Escritura)
DROP TABLE IF EXISTS settings CASCADE;
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  author_name TEXT,
  author_bio TEXT,
  author_image TEXT,
  categories TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID DEFAULT auth.uid()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Auth All Settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Pedidos (Privado Total - Solo Admin ve pedidos)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Nadie público puede leer pedidos ajenos (idealmente)
-- Permitimos insertar pedidos a anónimos (clientes comprando)
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Solo admin autenticado puede ver/editar pedidos
CREATE POLICY "Auth Read Orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth Update Orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 4. Reseñas (Público Lectura / Público Escritura Controlada)
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Solo admin borra reseñas
CREATE POLICY "Auth Delete Reviews" ON reviews FOR DELETE TO authenticated USING (true);
