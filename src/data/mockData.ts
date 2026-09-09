import {
  MenuItem,
  Table,
  Order,
  InventoryItem,
  Expense,
  Supplier,
  PurchaseOrder,
  Recipe,
  StaffMember,
  CustomerProfile,
  CompanySettings
} from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // 1. POLLOS (Página 1 de la Carta)
  // ==========================================
  {
    id: 'pollo-frito',
    plu: '101',
    name: 'Pollo Frito (Entero)',
    description: 'Pollo frito entero servido con papa salada y arepa.',
    price: 35000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas de la Casa',
        options: [
          { id: 'aji-casero', name: 'Ají Casero Asadero', price: 0 },
          { id: 'salsa-ajo', name: 'Salsa de Ajo Criolla', price: 0 },
          { id: 'salsa-bbq', name: 'Salsa BBQ', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'medio-pollo-frito',
    plu: '103',
    name: '1/2 Pollo Frito',
    description: 'Medio pollo frito servido con papa salada y arepa.',
    price: 18500,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '10m',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas de la Casa',
        options: [
          { id: 'aji-casero', name: 'Ají Casero Asadero', price: 0 },
          { id: 'salsa-ajo', name: 'Salsa de Ajo Criolla', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'cuarto-pollo-frito',
    plu: '105',
    name: '1/4 Pollo Frito',
    description: 'Un cuarto de pollo frito servido con papa salada y arepa.',
    price: 10000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '5m',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'presa-frito',
        name: 'Presa',
        options: [
          { id: 'pechuga-ala', name: 'Pechuga y Ala', price: 0 },
          { id: 'pierna-pernil', name: 'Pierna Pernil', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'pollo-broster',
    plu: '102',
    name: 'Pollo Broster (Entero)',
    description: 'Pollo broaster crujiente entero servido con yuca y arepa frita.',
    price: 37000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas de la Casa',
        options: [
          { id: 'aji-casero', name: 'Ají Casero Asadero', price: 0 },
          { id: 'salsa-ajo', name: 'Salsa de Ajo Criolla', price: 0 },
          { id: 'miel', name: 'Miel de Abejas', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'medio-pollo-broster',
    plu: '104',
    name: '1/2 Pollo Broster',
    description: 'Medio pollo broaster crujiente servido con yuca y arepa frita.',
    price: 19500,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '10m',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas de la Casa',
        options: [
          { id: 'aji-casero', name: 'Ají Casero Asadero', price: 0 },
          { id: 'salsa-ajo', name: 'Salsa de Ajo Criolla', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'cuarto-pollo-broster',
    plu: '106',
    name: '1/4 Pollo Broster',
    description: 'Un cuarto de pollo broaster crujiente servido con yuca y arepa frita.',
    price: 10500,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '5m',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'presa-broster',
        name: 'Presa',
        options: [
          { id: 'pechuga-ala', name: 'Pechuga y Ala', price: 0 },
          { id: 'pierna-pernil', name: 'Pierna Pernil', price: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // 2. SOPAS (Página 1 de la Carta)
  // ==========================================
  {
    id: 'sopa-ajiaco',
    plu: '401',
    name: 'Ajiaco Santafereño',
    description: 'Presa de pollo y porción de arroz.',
    price: 11000,
    categoryId: 'sopas',
    prepTime: '8m',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'sopa-mondongo',
    plu: '402',
    name: 'Sopa de Mondongo',
    description: 'Tradicional sopa de mondongo servida con porción de arroz.',
    price: 11000,
    categoryId: 'sopas',
    prepTime: '8m',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sopa-menudencias',
    plu: '403',
    name: 'Sopa de Menudencias',
    description: 'Sopa casera con menudencias y porción de arroz.',
    price: 7000,
    categoryId: 'sopas',
    prepTime: '5m',
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&auto=format&fit=crop&q=80'
  },

  // ==========================================
  // 3. COMBOS (Página 1 de la Carta)
  // ==========================================
  {
    id: 'combo-frito',
    plu: '201',
    name: 'Combo Frito',
    description: '1 pollo, plátano, papa salada, arepa y gaseosa 1.5L.',
    price: 45000,
    categoryId: 'combos',
    subCategory: 'familiar',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1527477321076-0e9e1c1ca756?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'gaseosa-combo',
        name: 'Gaseosa 1.5L',
        options: [
          { id: 'manzana-15', name: 'Postobón Manzana 1.5L', price: 0 },
          { id: 'colombiana-15', name: 'Colombiana 1.5L', price: 0 },
          { id: 'coca-cola-15', name: 'Coca-Cola 1.5L', price: 0 },
          { id: 'cuatro-15', name: 'Quatro 1.5L', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'combo-broster',
    plu: '202',
    name: 'Combo Broster',
    description: '1 Pollo broaster, arepa y yuca frita, plátano y gaseosa 1.5L.',
    price: 47000,
    categoryId: 'combos',
    subCategory: 'familiar',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'gaseosa-combo',
        name: 'Gaseosa 1.5L',
        options: [
          { id: 'manzana-15', name: 'Postobón Manzana 1.5L', price: 0 },
          { id: 'colombiana-15', name: 'Colombiana 1.5L', price: 0 },
          { id: 'coca-cola-15', name: 'Coca-Cola 1.5L', price: 0 },
          { id: 'cuatro-15', name: 'Quatro 1.5L', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'combo-mixto',
    plu: '203',
    name: 'Combo Mixto',
    description: 'Medio pollo frito, medio pollo broaster, yuca frita, arepa frita, papa salada, arepa, plátano y gaseosa 1.5L.',
    price: 47000,
    categoryId: 'combos',
    subCategory: 'familiar',
    prepTime: '18m',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'gaseosa-combo',
        name: 'Gaseosa 1.5L',
        options: [
          { id: 'manzana-15', name: 'Postobón Manzana 1.5L', price: 0 },
          { id: 'colombiana-15', name: 'Colombiana 1.5L', price: 0 },
          { id: 'coca-cola-15', name: 'Coca-Cola 1.5L', price: 0 },
          { id: 'cuatro-15', name: 'Quatro 1.5L', price: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // 4. A LA CARTA (Página 2 de la Carta)
  // ==========================================
  {
    id: 'churrasco',
    plu: '301',
    name: 'Churrasco',
    description: 'Papa francesa, ensalada y patacón.',
    price: 31000,
    categoryId: 'alacarta',
    prepTime: '18m',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'termino-carne',
        name: 'Término de la Carne',
        options: [
          { id: 'termino-medio', name: 'Término Medio (1/2)', price: 0 },
          { id: 'tres-cuartos', name: 'Tres Cuartos (3/4)', price: 0 },
          { id: 'bien-asado', name: 'Bien Asado', price: 0 }
        ]
      },
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'carne-asada',
    plu: '302',
    name: 'Carne Asada',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'sobrebarriga',
    plu: '303',
    name: 'Sobrebarriga',
    description: 'Arroz, papa francesa, ensalada y patacón (en salsa o al horno).',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '12m',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'prep-sobrebarriga',
        name: 'Tipo de Preparación',
        options: [
          { id: 'al-horno', name: 'Al Horno', price: 0 },
          { id: 'en-salsa', name: 'En Salsa Criolla', price: 0 }
        ]
      },
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'costillas',
    plu: '304',
    name: 'Costillas',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '18m',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'lomo-cerdo',
    plu: '305',
    name: 'Lomo de Cerdo',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'pechuga-plancha',
    plu: '306',
    name: 'Pechuga a la Plancha',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '12m',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'chuleta-cerdo',
    plu: '307',
    name: 'Chuleta de Cerdo',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'bagre',
    plu: '308',
    name: 'Bagre en Salsa o Frito',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 31000,
    categoryId: 'alacarta',
    prepTime: '18m',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'prep-bagre',
        name: 'Tipo de Preparación',
        options: [
          { id: 'en-salsa', name: 'En Salsa Criolla', price: 0 },
          { id: 'frito', name: 'Frito Crocante', price: 0 }
        ]
      },
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'mojarra',
    plu: '309',
    name: 'Mojarra Frita',
    description: 'Arroz, papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '18m',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'trucha',
    plu: '310',
    name: 'Trucha',
    description: 'Papa francesa, ensalada y patacón.',
    price: 30000,
    categoryId: 'alacarta',
    prepTime: '15m',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'bandeja-pollo',
    plu: '311',
    name: 'Bandeja con Pollo',
    description: 'Papa francesa, arroz, ensalada y patacón.',
    price: 18000,
    categoryId: 'alacarta',
    prepTime: '10m',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'arroz-con-pollo',
    plu: '312',
    name: 'Arroz con Pollo',
    description: 'Papa francesa, ensalada y patacón.',
    price: 20000,
    categoryId: 'alacarta',
    prepTime: '10m',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'empaque-icopor',
        name: 'Empaque Icopor (+1.000 Llevar)',
        options: [
          { id: 'salon', name: 'Consumo en Salón', price: 0 },
          { id: 'icopor', name: 'Empaque Icopor para Llevar', price: 1000 }
        ]
      }
    ]
  },

  // ==========================================
  // 5. ADICIONES (Página 3 de la Carta)
  // ==========================================
  {
    id: 'papa-francesa',
    plu: '501',
    name: 'Papa Francesa',
    description: 'Porción de papa francesa crocante.',
    price: 5000,
    categoryId: 'adiciones',
    prepTime: '6m',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'papa-salada',
    plu: '502',
    name: 'Papa Salada',
    description: 'Porción de papa salada tradicional asadero.',
    price: 5000,
    categoryId: 'adiciones',
    prepTime: '3m',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'yuca-frita',
    plu: '503',
    name: 'Yuca Frita',
    description: 'Porción de yuca frita crocante.',
    price: 5000,
    categoryId: 'adiciones',
    prepTime: '6m',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'ensalada',
    plu: '504',
    name: 'Ensalada del Día',
    description: 'Porción de ensalada del día fresca.',
    price: 2500,
    categoryId: 'adiciones',
    prepTime: '2m',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'arroz-porcion',
    plu: '505',
    name: 'Porción de Arroz',
    description: 'Porción de arroz blanco caliente.',
    price: 2500,
    categoryId: 'adiciones',
    prepTime: '2m',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'platano-asado',
    plu: '506',
    name: 'Plátano Asado',
    description: 'Plátano maduro asado al carbón.',
    price: 4000,
    categoryId: 'adiciones',
    prepTime: '5m',
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // ==========================================
  // 6. BEBIDAS (Página 3 de la Carta)
  // ==========================================
  {
    id: 'gaseosa-350',
    plu: '601',
    name: 'Gaseosa 350 mL',
    description: 'Presentación personal 350mL bien fría.',
    price: 2500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'sabor-gaseosa-350',
        name: 'Sabor',
        options: [
          { id: 'manzana', name: 'Postobón Manzana', price: 0 },
          { id: 'colombiana', name: 'Colombiana', price: 0 },
          { id: 'coca-cola', name: 'Coca-Cola', price: 0 },
          { id: 'pepsi', name: 'Pepsi', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'gaseosa-400',
    plu: '602',
    name: 'Gaseosa 400 mL',
    description: 'Presentación 400mL en botella.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'sabor-gaseosa-400',
        name: 'Sabor',
        options: [
          { id: 'coca-cola', name: 'Coca-Cola', price: 0 },
          { id: 'quatro', name: 'Quatro Toronja', price: 0 },
          { id: 'sprite', name: 'Sprite', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'gaseosa-15',
    plu: '603',
    name: 'Gaseosa 1.5 L',
    description: 'Presentación familiar 1.5 Litros.',
    price: 7000,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sabor-gaseosa-15',
        name: 'Sabor',
        options: [
          { id: 'manzana', name: 'Postobón Manzana', price: 0 },
          { id: 'colombiana', name: 'Colombiana', price: 0 },
          { id: 'coca-cola', name: 'Coca-Cola', price: 0 },
          { id: 'cuatro', name: 'Quatro', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'gaseosa-h2o',
    plu: '604',
    name: 'Gaseosa H2O 500 mL',
    description: 'H2O saborizada 500mL.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'pony-malta',
    plu: '605',
    name: 'Pony Malta 330 mL',
    description: 'Pony Malta botella 330mL.',
    price: 2500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bretana',
    plu: '606',
    name: 'Bretaña 300 mL',
    description: 'Agua carbonatada Bretaña 300mL.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'jugo-hit-350',
    plu: '607',
    name: 'Jugo Hit 350 mL',
    description: 'Jugo Hit botella personal 350mL.',
    price: 2500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'sabor-hit-350',
        name: 'Sabor de Fruta',
        options: [
          { id: 'mora', name: 'Mora', price: 0 },
          { id: 'mango', name: 'Mango', price: 0 },
          { id: 'lulo', name: 'Lulo', price: 0 },
          { id: 'naranja-pina', name: 'Naranja Piña', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'jugo-hit-500',
    plu: '608',
    name: 'Jugo Hit 500 mL',
    description: 'Jugo Hit botella 500mL.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    availableModifiers: [
      {
        id: 'sabor-hit-500',
        name: 'Sabor de Fruta',
        options: [
          { id: 'mora', name: 'Mora', price: 0 },
          { id: 'mango', name: 'Mango', price: 0 },
          { id: 'lulo', name: 'Lulo', price: 0 },
          { id: 'naranja-pina', name: 'Naranja Piña', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'agua-botella',
    plu: '609',
    name: 'Agua Botella 500 mL',
    description: 'Agua pura de manantial 500mL.',
    price: 2500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cerveza-coronita',
    plu: '610',
    name: 'Cerveza Coronita',
    description: 'Cerveza Corona Extra botella 210mL.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1608270119830-4e365cb684c3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cerveza-aguila',
    plu: '611',
    name: 'Cerveza Águila',
    description: 'Cerveza Águila tradicional fría.',
    price: 3500,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'cerveza-colapola',
    plu: '612',
    name: 'Cola & Pola',
    description: 'Refajo tradicional Cola & Pola bien frío.',
    price: 3000,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't-1', name: 'Mesa 01', area: 'Principal', capacity: 4, status: 'available' },
  { id: 't-2', name: 'Mesa 02', area: 'Principal', capacity: 4, status: 'occupied', guestCount: 3, elapsedMinutes: 24, serverName: 'Carlos' },
  { id: 't-3', name: 'Mesa 03', area: 'Principal', capacity: 2, status: 'occupied', guestCount: 2, elapsedMinutes: 42, serverName: 'Ana' },
  { id: 't-4', name: 'Mesa 04', area: 'Principal', capacity: 6, status: 'reserved' },
  { id: 't-5', name: 'Mesa 05', area: 'Terraza', capacity: 4, status: 'available' },
  { id: 't-6', name: 'Mesa 06', area: 'Terraza', capacity: 8, status: 'occupied', guestCount: 7, elapsedMinutes: 15, serverName: 'Carlos' },
  { id: 't-7', name: 'Mesa 07', area: 'Barra', capacity: 2, status: 'available' },
  { id: 't-8', name: 'Mesa 08', area: 'Barra', capacity: 2, status: 'payment_pending', guestCount: 1, elapsedMinutes: 55, serverName: 'Ana' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-4091',
    orderNumber: 4091,
    tableName: 'Mesa 02',
    customerName: 'María Rodríguez',
    customerId: 'cust-1',
    type: 'dine-in',
    items: [
      {
        id: 'item-10',
        menuItemId: 'combo-frito',
        name: 'Combo Frito',
        basePrice: 45000,
        totalUnitPrice: 45000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527477321076-0e9e1c1ca756?w=600&auto=format&fit=crop&q=80',
        selectedModifiers: []
      }
    ],
    subtotal: 45000,
    tax: 8550,
    discount: 0,
    tip: 4500,
    total: 58050,
    status: 'preparing',
    createdAt: '2026-08-23T16:10:00Z',
    paymentMethod: 'card',
    serverName: 'Carlos'
  },
  {
    id: 'ORD-4090',
    orderNumber: 4090,
    tableName: 'Mesa 06',
    customerName: 'Juan Carlos Pérez',
    customerId: 'cust-2',
    type: 'dine-in',
    items: [
      {
        id: 'item-20',
        menuItemId: 'pollo-frito',
        name: 'Pollo Frito',
        basePrice: 35000,
        totalUnitPrice: 35000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
        selectedModifiers: []
      },
      {
        id: 'item-21',
        menuItemId: 'yuca-frita',
        name: 'Yuca Frita',
        basePrice: 5000,
        totalUnitPrice: 5000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
        selectedModifiers: []
      }
    ],
    subtotal: 80000,
    tax: 15200,
    discount: 0,
    tip: 8000,
    total: 103200,
    status: 'completed',
    createdAt: '2026-08-23T15:50:00Z',
    paymentMethod: 'cash',
    paidAmount: 110000,
    change: 6800,
    serverName: 'Ana'
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'INS-101',
    name: 'Pollo Entero Fresco (Marinado)',
    category: 'carnes',
    stockQuantity: 18,
    unit: 'unidades',
    minStockThreshold: 30,
    costPerUnit: 24000,
    supplier: 'Avícola San Pedro S.A.S.',
    lastRestocked: '2026-08-23'
  },
  {
    id: 'inv-2',
    sku: 'INS-102',
    name: 'Carbón Vegetal de Encina',
    category: 'insumos',
    stockQuantity: 45,
    unit: 'kg',
    minStockThreshold: 100,
    costPerUnit: 3500,
    supplier: 'Carbones del Sur S.A.S.',
    lastRestocked: '2026-08-20'
  },
  {
    id: 'inv-3',
    sku: 'INS-103',
    name: 'Yuca Amarilla Criolla',
    category: 'verduras',
    stockQuantity: 65,
    unit: 'kg',
    minStockThreshold: 25,
    costPerUnit: 3800,
    supplier: 'Distribuidora Agrícola Central',
    lastRestocked: '2026-08-22'
  },
  {
    id: 'inv-4',
    sku: 'INS-104',
    name: 'Salsa de Ají Amarillo Casero',
    category: 'insumos',
    stockQuantity: 8,
    unit: 'litros',
    minStockThreshold: 15,
    costPerUnit: 9000,
    supplier: 'Cocina Central El Remix',
    lastRestocked: '2026-08-21'
  },
  {
    id: 'inv-5',
    sku: 'INS-105',
    name: 'Inca Kola 1.5L (Pack 6u)',
    category: 'bebidas',
    stockQuantity: 24,
    unit: 'paquetes',
    minStockThreshold: 10,
    costPerUnit: 28000,
    supplier: 'Distribuidora Bebidas del Valle',
    lastRestocked: '2026-08-22'
  },
  {
    id: 'inv-6',
    sku: 'INS-106',
    name: 'Cajas Térmicas Pollo Entero',
    category: 'empaques',
    stockQuantity: 180,
    unit: 'unidades',
    minStockThreshold: 50,
    costPerUnit: 800,
    supplier: 'Empaques Biodegradables S.A.',
    lastRestocked: '2026-08-19'
  },
  {
    id: 'inv-7',
    sku: 'INS-107',
    name: 'Costillas de Cerdo Premium',
    category: 'carnes',
    stockQuantity: 12,
    unit: 'kg',
    minStockThreshold: 20,
    costPerUnit: 26000,
    supplier: 'Carnes de la Sierra S.A.S.',
    lastRestocked: '2026-08-21'
  },
  {
    id: 'inv-8',
    sku: 'INS-108',
    name: 'Papas Amarillas Selección Especial',
    category: 'verduras',
    stockQuantity: 90,
    unit: 'kg',
    minStockThreshold: 40,
    costPerUnit: 3200,
    supplier: 'Distribuidora Agrícola Central',
    lastRestocked: '2026-08-23'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Compra de 50 Pollos Frescos',
    category: 'insumos',
    amount: 1200000,
    date: '2026-08-23',
    supplier: 'Avícola San Pedro S.A.S.',
    notes: 'Lote marinado para fin de semana'
  },
  {
    id: 'exp-2',
    title: 'Servicio de Gas Industrial Horno 1',
    category: 'servicios',
    amount: 380000,
    date: '2026-08-22',
    supplier: 'Gas del Pacífico',
    notes: 'Factura mensual de consumo'
  },
  {
    id: 'exp-3',
    title: 'Cargamento Carbón Vegetal 200kg',
    category: 'insumos',
    amount: 700000,
    date: '2026-08-20',
    supplier: 'Carbones del Sur S.A.S.',
    notes: 'Suministro carbón de encina'
  },
  {
    id: 'exp-4',
    title: 'Mantenimiento Preventivo de Campana Extractora',
    category: 'mantenimiento',
    amount: 250000,
    date: '2026-08-18',
    supplier: 'TecniServicios Hostelería',
    notes: 'Limpieza de filtros y motor'
  },
  {
    id: 'exp-5',
    title: 'Compra de Cajas y Contenedores Biodegradables',
    category: 'insumos',
    amount: 220000,
    date: '2026-08-19',
    supplier: 'Empaques Biodegradables S.A.',
    notes: '500 bolsas + 200 cajas pollo'
  }
];

// --- INITIAL SUPPLIERS ---
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    nit: '900.123.456-1',
    name: 'Avícola San Pedro S.A.S.',
    contactName: 'Guillermo Mendoza',
    phone: '+57 310 456 7890',
    email: 'ventas@avicolasanpedro.com',
    category: 'carnes',
    rating: 5
  },
  {
    id: 'sup-2',
    nit: '890.987.654-3',
    name: 'Distribuidora Agrícola Central',
    contactName: 'Marta Lucía Gómez',
    phone: '+57 315 888 2211',
    email: 'pedidos@agricolacentral.co',
    category: 'verduras',
    rating: 4
  },
  {
    id: 'sup-3',
    nit: '901.555.444-2',
    name: 'Carbones del Sur S.A.S.',
    contactName: 'Jorge Isaacs',
    phone: '+57 300 123 9988',
    email: 'contacto@carbonesdelsur.com',
    category: 'insumos',
    rating: 5
  },
  {
    id: 'sup-4',
    nit: '800.333.111-9',
    name: 'Distribuidora Bebidas del Valle',
    contactName: 'Claudia Restrepo',
    phone: '+57 320 654 3210',
    email: 'atencion@bebidasdelvalle.com',
    category: 'bebidas',
    rating: 4
  },
  {
    id: 'sup-5',
    nit: '900.888.777-5',
    name: 'Empaques Biodegradables S.A.',
    contactName: 'Felipe Jaramillo',
    phone: '+57 311 999 0011',
    email: 'ventas@bioempaques.com',
    category: 'empaques',
    rating: 5
  }
];

// --- INITIAL PURCHASE ORDERS ---
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-088',
    supplierId: 'sup-1',
    supplierName: 'Avícola San Pedro S.A.S.',
    items: [
      {
        inventoryItemId: 'inv-1',
        inventoryItemName: 'Pollo Entero Fresco (Marinado)',
        quantity: 40,
        unitCost: 24000,
        unit: 'unidades'
      }
    ],
    totalAmount: 960000,
    status: 'received',
    createdDate: '2026-08-20',
    expectedDeliveryDate: '2026-08-21',
    receivedDate: '2026-08-21',
    notes: 'Recepción completa de 40 pollos marinados en frío.'
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-089',
    supplierId: 'sup-3',
    supplierName: 'Carbones del Sur S.A.S.',
    items: [
      {
        inventoryItemId: 'inv-2',
        inventoryItemName: 'Carbón Vegetal de Encina',
        quantity: 100,
        unitCost: 3500,
        unit: 'kg'
      }
    ],
    totalAmount: 350000,
    status: 'ordered',
    createdDate: '2026-08-23',
    expectedDeliveryDate: '2026-08-25',
    notes: 'Entrega programada para horneado del fin de semana.'
  }
];

// --- INITIAL RECIPES (ESCANDALLOS - COSTEO DE PLATOS) ---
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-101',
    menuItemId: 'pollo-entero',
    menuItemName: 'Pollo Entero',
    yieldServings: 1,
    preparationNotes: 'Pollo marinado al carbón. Requiere 1 unidad de pollo + 1 kg carbón proporcional.',
    ingredients: [
      {
        inventoryItemId: 'inv-1',
        inventoryItemName: 'Pollo Entero Fresco (Marinado)',
        quantityNeeded: 1,
        unit: 'unidades',
        unitCost: 24000
      },
      {
        inventoryItemId: 'inv-2',
        inventoryItemName: 'Carbón Vegetal de Encina',
        quantityNeeded: 1.2,
        unit: 'kg',
        unitCost: 3500
      },
      {
        inventoryItemId: 'inv-4',
        inventoryItemName: 'Salsa de Ají Amarillo Casero',
        quantityNeeded: 0.1,
        unit: 'litros',
        unitCost: 9000
      },
      {
        inventoryItemId: 'inv-6',
        inventoryItemName: 'Cajas Térmicas Pollo Entero',
        quantityNeeded: 1,
        unit: 'unidades',
        unitCost: 800
      }
    ]
  },
  {
    id: 'rec-102',
    menuItemId: 'combo-familiar',
    menuItemName: 'Combo Familiar Asadero',
    yieldServings: 1,
    preparationNotes: '1 Pollo + Papa + Yuca + Ensalada + Gaseosa 1.5L',
    ingredients: [
      {
        inventoryItemId: 'inv-1',
        inventoryItemName: 'Pollo Entero Fresco (Marinado)',
        quantityNeeded: 1,
        unit: 'unidades',
        unitCost: 24000
      },
      {
        inventoryItemId: 'inv-3',
        inventoryItemName: 'Yuca Amarilla Criolla',
        quantityNeeded: 0.8,
        unit: 'kg',
        unitCost: 3800
      },
      {
        inventoryItemId: 'inv-8',
        inventoryItemName: 'Papas Amarillas Selección Especial',
        quantityNeeded: 0.8,
        unit: 'kg',
        unitCost: 3200
      },
      {
        inventoryItemId: 'inv-5',
        inventoryItemName: 'Inca Kola 1.5L (Pack 6u)',
        quantityNeeded: 0.166,
        unit: 'paquetes',
        unitCost: 28000
      }
    ]
  },
  {
    id: 'rec-103',
    menuItemId: 'yuca-frita',
    menuItemName: 'Yuca Frita Crocante (L)',
    yieldServings: 1,
    ingredients: [
      {
        inventoryItemId: 'inv-3',
        inventoryItemName: 'Yuca Amarilla Criolla',
        quantityNeeded: 0.6,
        unit: 'kg',
        unitCost: 3800
      }
    ]
  }
];

// --- INITIAL STAFF (PERSONAL Y TURNOS - ERP RRHH) ---
export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Carlos Ramírez',
    role: 'mesero',
    phone: '+57 312 345 6789',
    email: 'carlos.ramirez@asaderoelremix.com',
    hourlyRate: 8500,
    shiftStatus: 'clocked_in',
    lastClockIn: '08:00 AM',
    salesCount: 42,
    totalSalesAmount: 2450000,
    rating: 4.9
  },
  {
    id: 'staff-2',
    name: 'Ana María Torres',
    role: 'cajero',
    phone: '+57 318 901 2345',
    email: 'ana.torres@asaderoelremix.com',
    hourlyRate: 9500,
    shiftStatus: 'clocked_in',
    lastClockIn: '07:45 AM',
    salesCount: 88,
    totalSalesAmount: 5800000,
    rating: 5.0
  },
  {
    id: 'staff-3',
    name: 'Don Mateo Holguín',
    role: 'parrillero',
    phone: '+57 301 777 4433',
    email: 'mateo.horno@asaderoelremix.com',
    hourlyRate: 11000,
    shiftStatus: 'clocked_in',
    lastClockIn: '07:30 AM',
    salesCount: 0,
    totalSalesAmount: 0,
    rating: 4.8
  },
  {
    id: 'staff-4',
    name: 'Laura Sofía Castro',
    role: 'mesero',
    phone: '+57 314 222 3344',
    email: 'laura.castro@asaderoelremix.com',
    hourlyRate: 8500,
    shiftStatus: 'clocked_out',
    salesCount: 28,
    totalSalesAmount: 1650000,
    rating: 4.7
  }
];

// --- INITIAL CUSTOMERS (CRM Y FIDELIZACIÓN - ERP) ---
export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'María Rodríguez',
    phone: '+57 310 987 6543',
    email: 'maria.rodriguez@gmail.com',
    address: 'Calle 45 # 23-10, Apto 402',
    favoriteDish: 'Combo Familiar Asadero',
    loyaltyPoints: 340,
    tier: 'Oro',
    totalSpent: 1250000,
    orderCount: 14,
    lastOrderDate: '2026-08-23'
  },
  {
    id: 'cust-2',
    name: 'Juan Carlos Pérez',
    phone: '+57 315 234 5678',
    email: 'jcperez@hotmail.com',
    address: 'Carrera 15 # 88-40, Barrio Versalles',
    favoriteDish: 'Pollo Entero',
    loyaltyPoints: 520,
    tier: 'VIP',
    totalSpent: 2480000,
    orderCount: 26,
    lastOrderDate: '2026-08-23'
  },
  {
    id: 'cust-3',
    name: 'Empresa Tech Solutions S.A.S',
    phone: '+57 300 555 1212',
    email: 'eventos@techsolutions.com',
    address: 'Avenida El Dorado # 68B-31, Oficina 501',
    favoriteDish: 'Combo Dúo Asado',
    loyaltyPoints: 890,
    tier: 'VIP',
    totalSpent: 4100000,
    orderCount: 32,
    lastOrderDate: '2026-08-21'
  },
  {
    id: 'cust-4',
    name: 'Roberto Gómez',
    phone: '+57 312 888 4455',
    email: 'roberto.gomez@outlook.com',
    address: 'Calle 10 # 5-12',
    favoriteDish: 'Cuarto de Pollo',
    loyaltyPoints: 95,
    tier: 'Bronce',
    totalSpent: 320000,
    orderCount: 4,
    lastOrderDate: '2026-08-19'
  }
];

// --- INITIAL COMPANY SETTINGS (ERP & DIAN) ---
export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'MAXI Pollos 22 - Asadero y Restaurante',
  nit: '901.482.910-4',
  address: 'Calle 100 # 15-45, Zona Gastronómica',
  phone: '+57 (601) 745-9000',
  email: 'contacto@maxipollos22.com',
  regimenFiscal: 'Régimen Común - Impuesto Nacional al Consumo',
  posResolutionNumber: '18764039201948',
  posResolutionPrefix: 'POS-',
  posResolutionRange: '1001 al 50000',
  posResolutionDate: '2026-01-15',
  impuestoConsumoPercent: 8,
  ivaPercent: 19,
  enableLoyaltyProgram: true,
  pointsPer1000Cop: 1,
  receiptHeaderMsg: '¡El mejor pollo asado y a la brasa con tradición!',
  receiptFooterMsg: 'Gracias por su preferencia. Propina voluntaria sugerida 10%.',
  adminPin: '1234'
};
