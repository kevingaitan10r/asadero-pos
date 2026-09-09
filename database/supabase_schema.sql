-- ==============================================================================
-- ASADERO POS & ERP - ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE
-- MAXI Pollos 22
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE PERFILES / USUARIOS CON ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT, -- Para compatibilidad en autenticacion rapida por usuario
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

-- 4. TABLA DE PLATOS DEL MENÚ
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

-- 5. TABLA DE INVENTARIO (CON PRECISIÓN DECIMAL PARA POLLOS: 0.25, 0.50, 1.00)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id TEXT PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL, -- ej. 'pollos', 'kg', 'unidades'
    min_stock_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10,
    cost_per_unit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    supplier TEXT,
    last_restocked DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE RECETAS (ESCANDALLOS - COSTEO)
CREATE TABLE IF NOT EXISTS public.recipes (
    id TEXT PRIMARY KEY,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE CASCADE,
    menu_item_name TEXT NOT NULL,
    yield_servings NUMERIC(8, 2) DEFAULT 1,
    preparation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE INGREDIENTES DE RECETAS (CONSUMO FRACCIONADO)
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id TEXT REFERENCES public.recipes(id) ON DELETE CASCADE,
    inventory_item_id TEXT REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    inventory_item_name TEXT NOT NULL,
    quantity_needed NUMERIC(10, 3) NOT NULL, -- ej. 0.250 para 1/4 pollo, 0.500 para 1/2 pollo
    unit TEXT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- 8. TABLA DE ÓRDENES / COMANDAS (TIEMPO REAL)
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
-- HABILITAR TIEMPO REAL (REALTIME) PARA ACTUALIZACIÓN INSTANTÁNEA EN CELULARES
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_items;

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para la app:
CREATE POLICY "Permitir lectura general de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de perfiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de perfiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura del menú" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Permitir lectura de categorías" ON public.categories FOR SELECT USING (true);

CREATE POLICY "Permitir lectura y modificación de inventario" ON public.inventory_items FOR ALL USING (true);
CREATE POLICY "Permitir lectura y modificación de recetas" ON public.recipes FOR ALL USING (true);
CREATE POLICY "Permitir lectura y modificación de ingredientes" ON public.recipe_ingredients FOR ALL USING (true);

CREATE POLICY "Permitir lectura y creación de órdenes" ON public.orders FOR ALL USING (true);
CREATE POLICY "Permitir lectura y creación de items de orden" ON public.order_items FOR ALL USING (true);

-- ==============================================================================
-- DATOS INICIALES (SEED DATA)
-- ==============================================================================

-- Categorías
INSERT INTO public.categories (id, name, icon, sort_order) VALUES
('pollos', 'Pollos Asados & Broster', '🍗', 1),
('combos', 'Combos Familiares', '🍱', 2),
('platos', 'Platos Especiales & Carnes', '🥩', 3),
('bebidas', 'Bebidas & Refrescos', '🥤', 4),
('adiciones', 'Acompañamientos', '🍟', 5)
ON CONFLICT (id) DO NOTHING;

-- Insumo Base: Pollo Entero (Unidad: pollos)
INSERT INTO public.inventory_items (id, sku, name, category, stock_quantity, unit, min_stock_threshold, cost_per_unit, supplier) VALUES
('inv-1', 'INS-101', 'Pollo Entero Fresco (Marinado)', 'carnes', 40.00, 'pollos', 15.00, 24000, 'Avícola San Pedro S.A.S.'),
('inv-2', 'INS-102', 'Carbón Vegetal de Encina', 'insumos', 80.00, 'kg', 30.00, 3500, 'Carbones del Sur S.A.S.'),
('inv-3', 'INS-103', 'Yuca Amarilla Criolla', 'verduras', 50.00, 'kg', 20.00, 3800, 'Distribuidora Agrícola Central'),
('inv-8', 'INS-108', 'Papas Amarillas Selección Especial', 'verduras', 60.00, 'kg', 25.00, 3200, 'Distribuidora Agrícola Central'),
('inv-6', 'INS-106', 'Cajas Térmicas Pollo Entero', 'empaques', 150.00, 'unidades', 40.00, 800, 'Empaques Biodegradables S.A.')
ON CONFLICT (id) DO NOTHING;

-- Platos Principales
INSERT INTO public.menu_items (id, plu, name, description, price, category_id, is_popular) VALUES
('cuarto-pollo-frito', '105', '1/4 Pollo Frito', 'Un cuarto de pollo frito servido con papa salada y arepa.', 10000, 'pollos', true),
('medio-pollo-frito', '103', '1/2 Pollo Frito', 'Medio pollo frito servido con papa salada y arepa.', 18500, 'pollos', true),
('pollo-frito', '101', 'Pollo Frito (Entero)', 'Pollo frito entero servido con papa salada y arepa.', 35000, 'pollos', true),
('cuarto-pollo-broster', '106', '1/4 Pollo Broster', 'Un cuarto de pollo broaster crujiente servido con yuca y arepa frita.', 10500, 'pollos', true),
('medio-pollo-broster', '104', '1/2 Pollo Broster', 'Medio pollo broaster crujiente servido con yuca y arepa frita.', 19500, 'pollos', true),
('pollo-broster', '102', 'Pollo Broster (Entero)', 'Pollo broaster crujiente entero servido con yuca y arepa frita.', 37000, 'pollos', true),
('combo-familiar', '201', 'Combo Familiar Asadero', '1 Pollo + Papa + Yuca + Ensalada + Gaseosa 1.5L', 46000, 'combos', true)
ON CONFLICT (id) DO NOTHING;

-- Recetas con Deducción Decimal Exacta
INSERT INTO public.recipes (id, menu_item_id, menu_item_name, yield_servings, preparation_notes) VALUES
('rec-101-quarter', 'cuarto-pollo-frito', '1/4 Pollo Frito', 1, 'Descuenta exactamente 0.25 pollos de nevera.'),
('rec-101-half', 'medio-pollo-frito', '1/2 Pollo Frito', 1, 'Descuenta exactamente 0.50 pollos de nevera.'),
('rec-101', 'pollo-frito', 'Pollo Frito (Entero)', 1, 'Descuenta 1.00 pollo entero de nevera.'),
('rec-102-broster-quarter', 'cuarto-pollo-broster', '1/4 Pollo Broster', 1, 'Descuenta exactamente 0.25 pollos broster.'),
('rec-102-broster-half', 'medio-pollo-broster', '1/2 Pollo Broster', 1, 'Descuenta exactamente 0.50 pollos broster.'),
('rec-102-broster', 'pollo-broster', 'Pollo Broster (Entero)', 1, 'Descuenta 1.00 pollo broster entero.')
ON CONFLICT (id) DO NOTHING;

-- Ingredientes BOM: 0.25, 0.50 y 1.00
INSERT INTO public.recipe_ingredients (recipe_id, inventory_item_id, inventory_item_name, quantity_needed, unit, unit_cost) VALUES
('rec-101-quarter', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.250, 'pollos', 24000),
('rec-101-half', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.500, 'pollos', 24000),
('rec-101', 'inv-1', 'Pollo Entero Fresco (Marinado)', 1.000, 'pollos', 24000),
('rec-102-broster-quarter', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.250, 'pollos', 24000),
('rec-102-broster-half', 'inv-1', 'Pollo Entero Fresco (Marinado)', 0.500, 'pollos', 24000),
('rec-102-broster', 'inv-1', 'Pollo Entero Fresco (Marinado)', 1.000, 'pollos', 24000);

-- Perfiles de usuario por defecto
INSERT INTO public.profiles (username, email, password_hash, full_name, role, phone) VALUES
('admin', 'admin@maxipollos.com', 'admin123', 'Administrador General', 'admin', '3001234567'),
('carlos', 'carlos@maxipollos.com', 'mesero123', 'Carlos Ramírez', 'mesero', '3123456789'),
('laura', 'laura@maxipollos.com', 'mesero123', 'Laura Castro', 'mesero', '3142223344')
ON CONFLICT (username) DO NOTHING;
