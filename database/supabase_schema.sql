-- ==============================================================================
-- ASADERO POS & ERP - ESQUEMA COMPLETO Y SEGURO PARA SUPABASE
-- MAXI Pollos 22 (Ejecución 100% Reentrable / Idempotente)
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE PERFILES / USUARIOS CON ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'mesero', 'cajero', 'parrillero')),
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE CATEGORÍAS DEL MENÚ
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INT DEFAULT 0
);

-- 4. TABLA DE PLATOS DEL MENÚ (CARTA COMPLETA)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    plu TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT false,
    prep_time TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE INVENTARIO (CON PRECISIÓN DECIMAL: 0.25, 0.50, 1.00 POLLOS)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id TEXT PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    min_stock_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10,
    cost_per_unit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    supplier TEXT,
    last_restocked DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE RECETAS (ESCANDALLOS)
CREATE TABLE IF NOT EXISTS public.recipes (
    id TEXT PRIMARY KEY,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE CASCADE,
    menu_item_name TEXT NOT NULL,
    yield_servings NUMERIC(8, 2) DEFAULT 1,
    preparation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE INGREDIENTES DE RECETAS (DEDUCCIÓN DECIMAL)
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id TEXT REFERENCES public.recipes(id) ON DELETE CASCADE,
    inventory_item_id TEXT REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    inventory_item_name TEXT NOT NULL,
    quantity_needed NUMERIC(10, 3) NOT NULL,
    unit TEXT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- 8. TABLA DE ÓRDENES / COMANDAS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeout', 'delivery')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_prep', 'ready', 'dispatched', 'paid', 'cancelled')),
    server_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    server_name TEXT NOT NULL,
    customer_name TEXT,
    delivery_address TEXT,
    delivery_phone TEXT,
    delivery_notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    paid_amount NUMERIC(12, 2),
    change_amount NUMERIC(12, 2),
    order_note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA DE ITEMS DE LA ORDEN
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    selected_modifiers JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- REALTIME (TIEMPO REAL) SEGURO
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'inventory_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_items;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
  END IF;
END $$;

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS) IDEMPOTENTES (DROP IF EXISTS + CREATE)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura general de perfiles" ON public.profiles;
CREATE POLICY "Permitir lectura general de perfiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción de perfiles" ON public.profiles;
CREATE POLICY "Permitir inserción de perfiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización de perfiles" ON public.profiles;
CREATE POLICY "Permitir actualización de perfiles" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir lectura del menú" ON public.menu_items;
CREATE POLICY "Permitir lectura del menú" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir modificación del menú" ON public.menu_items;
CREATE POLICY "Permitir modificación del menú" ON public.menu_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de categorías" ON public.categories;
CREATE POLICY "Permitir lectura de categorías" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura y modificación de inventario" ON public.inventory_items;
CREATE POLICY "Permitir lectura y modificación de inventario" ON public.inventory_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura y modificación de recetas" ON public.recipes;
CREATE POLICY "Permitir lectura y modificación de recetas" ON public.recipes FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura y modificación de ingredientes" ON public.recipe_ingredients;
CREATE POLICY "Permitir lectura y modificación de ingredientes" ON public.recipe_ingredients FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura y creación de órdenes" ON public.orders;
CREATE POLICY "Permitir lectura y creación de órdenes" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura y creación de items de orden" ON public.order_items;
CREATE POLICY "Permitir lectura y creación de items de orden" ON public.order_items FOR ALL USING (true);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (SEED DATA LIMPIO)
-- ==============================================================================

-- 1. Categorías
INSERT INTO public.categories (id, name, icon, sort_order) VALUES
('pollos', 'Pollos Asados & Broster', '🍗', 1),
('sopas', 'Sopas Tradicionales', '🍲', 2),
('combos', 'Combos Familiares', '🍱', 3),
('alacarta', 'Platos a la Carta', '🥩', 4),
('adiciones', 'Adiciones & Acompañamientos', '🍟', 5),
('bebidas', 'Bebidas & Refrescos', '🥤', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;

-- 2. Inventario inicial (Pollo en unidad 'pollos' para cálculo decimal 0.25, 0.50, 1.00)
INSERT INTO public.inventory_items (id, sku, name, category, stock_quantity, unit, min_stock_threshold, cost_per_unit, supplier) VALUES
('inv-1', 'INS-101', 'Pollo Entero Fresco (Marinado)', 'carnes', 50.00, 'pollos', 15.00, 24000, 'Avícola San Pedro S.A.S.'),
('inv-2', 'INS-102', 'Carbón Vegetal de Encina', 'insumos', 80.00, 'kg', 30.00, 3500, 'Carbones del Sur S.A.S.'),
('inv-3', 'INS-103', 'Yuca Amarilla Criolla', 'verduras', 50.00, 'kg', 20.00, 3800, 'Distribuidora Agrícola Central'),
('inv-8', 'INS-108', 'Papas Amarillas Selección Especial', 'verduras', 60.00, 'kg', 25.00, 3200, 'Distribuidora Agrícola Central'),
('inv-6', 'INS-106', 'Cajas Térmicas Pollo Entero', 'empaques', 150.00, 'unidades', 40.00, 800, 'Empaques Biodegradables S.A.')
ON CONFLICT (id) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity, unit = EXCLUDED.unit;

-- 3. Platos de la Carta (42 platos completos)
INSERT INTO public.menu_items (id, plu, name, description, price, category_id, is_popular, prep_time, image_url) VALUES
('pollo-frito', '101', 'Pollo Frito (Entero)', 'Pollo frito entero servido con papa salada y arepa.', 35000, 'pollos', true, '15m', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80'),
('medio-pollo-frito', '103', '1/2 Pollo Frito', 'Medio pollo frito servido con papa salada y arepa.', 18500, 'pollos', true, '10m', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80'),
('cuarto-pollo-frito', '105', '1/4 Pollo Frito', 'Un cuarto de pollo frito servido con papa salada y arepa.', 10000, 'pollos', true, '5m', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80'),
('pollo-broster', '102', 'Pollo Broster (Entero)', 'Pollo broaster crujiente entero servido con yuca y arepa frita.', 37000, 'pollos', true, '15m', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80'),
('medio-pollo-broster', '104', '1/2 Pollo Broster', 'Medio pollo broaster crujiente servido con yuca y arepa frita.', 19500, 'pollos', true, '10m', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80'),
('cuarto-pollo-broster', '106', '1/4 Pollo Broster', 'Un cuarto de pollo broaster crujiente servido con yuca y arepa frita.', 10500, 'pollos', true, '5m', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80'),
('sopa-ajiaco', '401', 'Ajiaco Santafereño', 'Presa de pollo y porción de arroz.', 11000, 'sopas', true, '8m', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80'),
('sopa-mondongo', '402', 'Sopa de Mondongo', 'Tradicional sopa de mondongo servida con porción de arroz.', 11000, 'sopas', false, '8m', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80'),
('sopa-menudencias', '403', 'Sopa de Menudencias', 'Sopa casera con menudencias y porción de arroz.', 7000, 'sopas', false, '5m', 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&auto=format&fit=crop&q=80'),
('combo-frito', '201', 'Combo Frito', '1 pollo, plátano, papa salada, arepa y gaseosa 1.5L.', 45000, 'combos', true, '15m', 'https://images.unsplash.com/photo-1527477321076-0e9e1c1ca756?w=600&auto=format&fit=crop&q=80'),
('combo-broster', '202', 'Combo Broster', '1 Pollo broaster, arepa y yuca frita, plátano y gaseosa 1.5L.', 47000, 'combos', true, '15m', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80'),
('combo-mixto', '203', 'Combo Mixto', 'Medio pollo frito, medio broaster, yuca, papa, arepas, plátano y gaseosa 1.5L.', 47000, 'combos', true, '18m', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80'),
('churrasco', '301', 'Churrasco', 'Papa francesa, ensalada y patacón.', 31000, 'alacarta', true, '18m', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'),
('carne-asada', '302', 'Carne Asada', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', true, '15m', 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80'),
('sobrebarriga', '303', 'Sobrebarriga', 'Arroz, papa francesa, ensalada y patacón (en salsa o al horno).', 30000, 'alacarta', false, '12m', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'),
('costillas', '304', 'Costillas', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', false, '18m', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'),
('lomo-cerdo', '305', 'Lomo de Cerdo', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', false, '15m', 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&auto=format&fit=crop&q=80'),
('pechuga-plancha', '306', 'Pechuga a la Plancha', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', true, '12m', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80'),
('chuleta-cerdo', '307', 'Chuleta de Cerdo', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', false, '15m', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'),
('bagre', '308', 'Bagre en Salsa o Frito', 'Arroz, papa francesa, ensalada y patacón.', 31000, 'alacarta', false, '18m', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80'),
('mojarra', '309', 'Mojarra Frita', 'Arroz, papa francesa, ensalada y patacón.', 30000, 'alacarta', false, '18m', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80'),
('trucha', '310', 'Trucha', 'Papa francesa, ensalada y patacón.', 30000, 'alacarta', false, '15m', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80'),
('bandeja-pollo', '311', 'Bandeja con Pollo', 'Papa francesa, arroz, ensalada y patacón.', 18000, 'alacarta', true, '10m', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80'),
('arroz-con-pollo', '312', 'Arroz con Pollo', 'Papa francesa, ensalada y patacón.', 20000, 'alacarta', true, '10m', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80'),
('papa-francesa', '501', 'Papa Francesa', 'Porción de papa francesa crocante.', 5000, 'adiciones', true, '6m', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80'),
('papa-salada', '502', 'Papa Salada', 'Porción de papa salada tradicional asadero.', 5000, 'adiciones', false, '3m', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'),
('yuca-frita', '503', 'Yuca Frita', 'Porción de yuca frita crocante.', 5000, 'adiciones', true, '6m', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'),
('ensalada', '504', 'Ensalada del Día', 'Porción de ensalada del día fresca.', 2500, 'adiciones', false, '2m', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'),
('arroz-porcion', '505', 'Porción de Arroz', 'Porción de arroz blanco caliente.', 2500, 'adiciones', false, '2m', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80'),
('platano-asado', '506', 'Plátano Asado', 'Plátano maduro asado al carbón.', 4000, 'adiciones', true, '5m', 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=600&auto=format&fit=crop&q=80'),
('gaseosa-350', '601', 'Gaseosa 350 mL', 'Presentación personal 350mL bien fría.', 2500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'),
('gaseosa-400', '602', 'Gaseosa 400 mL', 'Presentación 400mL en botella.', 3500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80'),
('gaseosa-15', '603', 'Gaseosa 1.5 L', 'Presentación familiar 1.5 Litros.', 7000, 'bebidas', true, '1m', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'),
('gaseosa-h2o', '604', 'Gaseosa H2O 500 mL', 'H2O saborizada 500mL.', 3500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80'),
('pony-malta', '605', 'Pony Malta 330 mL', 'Pony Malta botella 330mL.', 2500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'),
('bretana', '606', 'Bretaña 300 mL', 'Agua carbonatada Bretaña 300mL.', 3500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80'),
('jugo-hit-350', '607', 'Jugo Hit 350 mL', 'Jugo Hit botella personal 350mL.', 2500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80'),
('jugo-hit-500', '608', 'Jugo Hit 500 mL', 'Jugo Hit botella 500mL.', 3500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80'),
('agua-botella', '609', 'Agua Botella 500 mL', 'Agua pura de manantial 500mL.', 2500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'),
('cerveza-coronita', '610', 'Cerveza Coronita', 'Cerveza Corona Extra botella 210mL.', 3500, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1608270119830-4e365cb684c3?w=600&auto=format&fit=crop&q=80'),
('cerveza-aguila', '611', 'Cerveza Águila', 'Cerveza Águila tradicional fría.', 3500, 'bebidas', true, '1m', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80'),
('cerveza-colapola', '612', 'Cola & Pola', 'Refajo tradicional Cola & Pola bien frío.', 3000, 'bebidas', false, '1m', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  image_url = EXCLUDED.image_url,
  is_popular = EXCLUDED.is_popular;

-- 4. Recetas BOM (Escandallos con deducción decimal)
INSERT INTO public.recipes (id, menu_item_id, menu_item_name, yield_servings, preparation_notes) VALUES
('rec-101-quarter', 'cuarto-pollo-frito', '1/4 Pollo Frito', 1, 'Descuenta exactamente 0.25 pollos de nevera.'),
('rec-101-half', 'medio-pollo-frito', '1/2 Pollo Frito', 1, 'Descuenta exactamente 0.50 pollos de nevera.'),
('rec-101', 'pollo-frito', 'Pollo Frito (Entero)', 1, 'Descuenta 1.00 pollo entero de nevera.'),
('rec-102-broster-quarter', 'cuarto-pollo-broster', '1/4 Pollo Broster', 1, 'Descuenta exactamente 0.25 pollos broster.'),
('rec-102-broster-half', 'medio-pollo-broster', '1/2 Pollo Broster', 1, 'Descuenta exactamente 0.50 pollos broster.'),
('rec-102-broster', 'pollo-broster', 'Pollo Broster (Entero)', 1, 'Descuenta 1.00 pollo broster entero.')
ON CONFLICT (id) DO UPDATE SET 
  menu_item_id = EXCLUDED.menu_item_id,
  menu_item_name = EXCLUDED.menu_item_name;

-- Limpiar e insertar ingredientes para evitar duplicados en re-ejecución
DELETE FROM public.recipe_ingredients WHERE recipe_id IN (
  'rec-101-quarter', 'rec-101-half', 'rec-101', 
  'rec-102-broster-quarter', 'rec-102-broster-half', 'rec-102-broster'
);

INSERT INTO public.recipe_ingredients (recipe_id, inventory_item_id, inventory_item_name, quantity_needed, unit, unit_cost) VALUES
('rec-101-quarter', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.250, 'pollos', 24000),
('rec-101-half', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.500, 'pollos', 24000),
('rec-101', 'inv-1', 'Pollo Entero Fresco (Marinado)', 1.000, 'pollos', 24000),
('rec-102-broster-quarter', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.250, 'pollos', 24000),
('rec-102-broster-half', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.500, 'pollos', 24000),
('rec-102-broster', 'inv-1', 'Pollo Entero Fresco (Marinado)', 1.000, 'pollos', 24000);

-- 5. Perfiles de usuario por defecto
INSERT INTO public.profiles (username, email, password_hash, full_name, role, phone) VALUES
('admin', 'admin@maxipollos.com', 'admin123', 'Administrador General', 'admin', '3001234567'),
('carlos', 'carlos@maxipollos.com', 'mesero123', 'Carlos Ramírez', 'mesero', '3123456789'),
('laura', 'laura@maxipollos.com', 'mesero123', 'Laura Castro', 'mesero', '3142223344')
ON CONFLICT (username) DO NOTHING;
