-- Limpieza Total. NO EJECUTAR si quieres preservar datos.
-- Esto borra y recrea toda la estructura.

-- 1. Libros
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Configuración
DROP TABLE IF EXISTS settings CASCADE;
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  author_name TEXT,
  author_bio TEXT,
  author_image TEXT,
  categories TEXT[], -- Array de strings
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pedidos
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB, -- Array de items del carrito
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reseñas
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS (Seguridad) --
-- Permitir lectura pública a todo
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);
CREATE POLICY "Admin All Books" ON books FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin All Settings" ON settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin All Orders" ON orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admin All Reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
