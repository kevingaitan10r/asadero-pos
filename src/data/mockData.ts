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
  // POLLOS
  {
    id: 'pollo-entero',
    plu: '101',
    name: 'Pollo Entero',
    description: 'Pollo asado tradicional al carbón, marinado 24h con especias secretas.',
    price: 48000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '15m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKG7OeffHF37LKwQ2RFSPAKUuec4rd0p_7t0Bf1p9Gz42xVrSPd5LfbGpha2xXWL9x0uZFeq2eT0aVkBtLzVuMj8X2kYZqGTVv4VAJpkol2-aqUF9r-BNhfjanGR4PdV4D5mXbZTzPg6uPV7_uzBSxplwxHpXD0oOCVcWB3VCzKEv_FrBKL4hhK7tRiBwxWbdaO1y5WmvxQ7FBGDkezxKwqWLwbLmU14ELIhDU_ur8QqXZO_1KYM',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas de la Casa',
        options: [
          { id: 'aji-extra', name: 'Extra Ají Casero', price: 2000 },
          { id: 'chimichurri', name: 'Chimichurri Asadero', price: 2000 },
          { id: 'salsa-ajo', name: 'Salsa de Ajo Criolla', price: 2000 },
          { id: 'salsa-bbq', name: 'Salsa BBQ Ahumada', price: 2500 }
        ]
      },
      {
        id: 'doneness',
        name: 'Término de la Piel',
        options: [
          { id: 'bien-dorado', name: 'Bien Dorado / Crocante', price: 0 },
          { id: 'tradicional', name: 'Término Tradicional Jugoso', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'medio-pollo',
    plu: '102',
    name: 'Medio Pollo',
    description: 'Medio pollo asado a la brasa con una salsa artesanal a elección.',
    price: 28000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '10m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPfdXZ-Ac1ZgG6jGSpnKEr2g84dnsGZPyQKqpd3e533o93Jz6a8jktWThTqEezaYPQtbyam44zltZpcrzfuATF_aI--kVyOKeziCvVzAF0BLh9bn7tsm-gDY15ogDTZEpe_fRdjlLt3SUKGEqSBp4hM0lAHHBIKdqj1h9K-8oItZJPem8IXXpWGj72vTxlwaMaWAW5BSDbhaoU9htqCLclxDv_vLp2Mro7i5T3kTpyb_0wa_ifY5A',
    isPopular: true,
    availableModifiers: [
      {
        id: 'sauces',
        name: 'Salsas',
        options: [
          { id: 'aji-extra', name: 'Extra Ají Casero', price: 2000 },
          { id: 'chimichurri', name: 'Chimichurri Asadero', price: 2000 }
        ]
      }
    ]
  },
  {
    id: 'cuarto-pollo',
    plu: '103',
    name: 'Cuarto de Pollo',
    description: 'Cuarto de pollo (pechuga o pierna pernil) ideal para porción personal.',
    price: 16000,
    categoryId: 'pollos',
    subCategory: 'traditional',
    prepTime: '5m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKs7zePN8YzPDfH4UmBrfNrHIyQUDHnQZqP2z22z7l1pbSxAPJ_NjEyeHi4dvJDMuBHndv7LpUyNnREaVCz-VE0kzZanR0oj39qKCXAzfrAlsZKv-spIIi99c2Zalw4IcYllwWduY4EkJZ527smC8dNey6V1d2bi_2Or63X2oKPiqAZaSbboyKXITOZ272dGWFujTfyNoK_rzjcqTjP0gd2T6UXqe120jry-KXzZrHOBGqfcKsB2w',
    isPopular: true,
    availableModifiers: [
      {
        id: 'presa',
        name: 'Elección de Presa',
        required: true,
        options: [
          { id: 'pechuga-ala', name: 'Pechuga y Ala', price: 1500 },
          { id: 'pierna-pernil', name: 'Pierna Pernil', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'pollo-picante',
    plu: '104',
    name: 'Pollo Picante Habanero',
    description: 'Pollo entero marinado en mezcla de chiles habaneros y pimentón ahumado.',
    price: 52000,
    categoryId: 'pollos',
    subCategory: 'spicy',
    prepTime: '20m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALmxbNvcq2DuphhNoVzcxY7NYBYd874zfivBMSZJbDET1rNsYf9xgCYLQg_PV0eo6U2VRoIeakcZ_vgKf03uOq1P3b2Umymsydc4f_v827pYgt-zqpMHzEj1fN-Pi8hdwzWb6VRlzGd8MGJSjNBBaLPGp6eSA1RhUqYA7CnDPdSqgrmXo98TVqHi_EtrfhxTjFBYN8j6sLb2q_qKmyyD6RnmZvuF_fkTb3aI1jmoNcudIifQDJfoI',
    isSpicy: true,
    availableModifiers: [
      {
        id: 'nivel-picante',
        name: 'Nivel de Picante',
        options: [
          { id: 'fuego-medio', name: 'Picante Medio', price: 0 },
          { id: 'fuego-extremo', name: 'Picante Fuego Extremo 🔥', price: 3000 }
        ]
      }
    ]
  },

  // COMBOS
  {
    id: 'combo-familiar',
    plu: '201',
    name: 'Combo Familiar Asadero',
    description: '1 Pollo entero + Papa francesa grande + Yuca frita + Ensalada de la casa + Gaseosa 1.5L.',
    price: 85000,
    categoryId: 'combos',
    subCategory: 'familiar',
    prepTime: '15m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAADN0Q6BM2WCgcYBmMsZylCjWSxFPLmhCgo6G6KzNtg0SwcO8zGQcsDSuQ3hyRtUNfnU6doPrA6m_8sWPljmtIJGMphmlC7My5hYbsBPpS4LqbebFeLNaHV6-VBDG6-3PRzB6SrgOA4eZA-xjxX427Agd3ioZWA0WHBkMgRcBuphOFoi1LbnDgDyHi2SIfzr07slZg9aPI72tdkRF67I5elToZCIy2Rw2bf0N2mmVtnIqZkG2R5yE',
    isPopular: true,
    availableModifiers: [
      {
        id: 'bebida-combo',
        name: 'Gaseosa 1.5L',
        options: [
          { id: 'coca-cola-15', name: 'Coca-Cola 1.5L', price: 0 },
          { id: 'inca-kola-15', name: 'Inca Kola 1.5L', price: 0 },
          { id: 'postobon-manzana', name: 'Postobón Manzana 1.5L', price: 0 },
          { id: 'colombiana-15', name: 'Colombiana 1.5L', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'combo-personal',
    plu: '202',
    name: 'Combo Cuarto Express',
    description: '1/4 de Pollo + Porción de papas fritas + Bebida personal 400ml.',
    price: 22000,
    categoryId: 'combos',
    subCategory: 'individual',
    prepTime: '8m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUm-bvCBlYrBx5wJ1mshQYfTXskTY7FsxlznMJcC8r8C_GjdbQ35qOZHJGcmBDxwGpCJ2xRv5mm29n5iD8U0lcKJBUJZ97Q6V1-4HCfY9I33QQMQd0XgxohJ9HpTuWLRTNsT1Qksb47--Zq7-AbsCLZDRwte9Un25QAFiFaj6QAOcWL75QYgIn096ATAJfW1IJ9q45FHg0ob04vFfjLh7nIuSMSaBH2LSFLwR8WdbGVrEOdxGf1Rs',
    isPopular: true
  },
  {
    id: 'combo-pareja',
    plu: '203',
    name: 'Combo Dúo Asado',
    description: 'Medio Pollo + Papas a la francesa + 2 Arepas con queso + 2 Bebidas personales.',
    price: 48000,
    categoryId: 'combos',
    subCategory: 'familiar',
    prepTime: '12m',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZE1wC2OcRWzDtRzP0cl3VVj2Xl68cFCpRxylq8Xlx0xuO6vuVr8C8j7PNDXw7CTP7x0HjoRJ2GP1fNlV4AkRxsubx5cFFLDKGz2KwdJTyMEUZKihdpbQ4s5Tb02QJdrKCsQB4kLDSiVtE3R8aZkdvpmxE72Z1yi5GqO3Hx5_0nKj5VAhH01o7ZFcyIsExp8N88RqqCnV4kEu2-zRsso7iynCRdDfHSWbyEkWPSFOz2dIAssXYmSY'
  },

  // ACOMPAÑAMIENTOS
  {
    id: 'yuca-frita',
    plu: '301',
    name: 'Yuca Frita Crocante (L)',
    description: 'Yuca fritadorada al punto perfecto con suero costeño de la casa.',
    price: 12000,
    categoryId: 'acompanamientos',
    prepTime: '8m',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'papas-fritas',
    plu: '302',
    name: 'Papas Fritas Grandes',
    description: 'Porción abundante de papas fritas tipo francesa crujientes.',
    price: 10000,
    categoryId: 'acompanamientos',
    prepTime: '6m',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ensalada-rusa',
    plu: '303',
    name: 'Ensalada Rusa Tradicional',
    description: 'Papa, zanahoria, arveja y mayonesa casera artesanal.',
    price: 9000,
    categoryId: 'acompanamientos',
    prepTime: '3m',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'arepas-queso',
    plu: '304',
    name: 'Arepas Asadas con Queso (3u)',
    description: 'Tres arepas de maíz blanco rellenas de queso mozzarella gratinado.',
    price: 8000,
    categoryId: 'acompanamientos',
    prepTime: '5m',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80'
  },

  // BEBIDAS
  {
    id: 'inca-kola',
    plu: '401',
    name: 'Inca Kola (1.5L)',
    description: 'Gaseosa Inca Kola helada 1.5 litros en botella retornable/desechable.',
    price: 8000,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    isPopular: true
  },
  {
    id: 'coca-cola',
    plu: '402',
    name: 'Coca-Cola Original (1.5L)',
    description: 'Refresco sabor original en presentación de 1.5L bien fría.',
    price: 8000,
    categoryId: 'bebidas',
    prepTime: '1m',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chicha-morada',
    plu: '403',
    name: 'Chicha Morada Artesanal (Jarra 1L)',
    description: 'Bebida natural de maíz morado, piña, manzana, canela y clavo de olor.',
    price: 10000,
    categoryId: 'bebidas',
    prepTime: '2m',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80'
  },

  // POSTRES
  {
    id: 'flan-casero',
    plu: '501',
    name: 'Flan de Leche Casero',
    description: 'Postre tradicional bañadito en caramelo artesanal.',
    price: 9000,
    categoryId: 'postres',
    prepTime: '2m',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80'
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
        menuItemId: 'combo-familiar',
        name: 'Combo Familiar Asadero',
        basePrice: 85000,
        totalUnitPrice: 85000,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAADN0Q6BM2WCgcYBmMsZylCjWSxFPLmhCgo6G6KzNtg0SwcO8zGQcsDSuQ3hyRtUNfnU6doPrA6m_8sWPljmtIJGMphmlC7My5hYbsBPpS4LqbebFeLNaHV6-VBDG6-3PRzB6SrgOA4eZA-xjxX427Agd3ioZWA0WHBkMgRcBuphOFoi1LbnDgDyHi2SIfzr07slZg9aPI72tdkRF67I5elToZCIy2Rw2bf0N2mmVtnIqZkG2R5yE',
        selectedModifiers: []
      }
    ],
    subtotal: 85000,
    tax: 7012,
    discount: 0,
    tip: 8500,
    total: 100512,
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
        menuItemId: 'pollo-entero',
        name: 'Pollo Entero',
        basePrice: 48000,
        totalUnitPrice: 48000,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKG7OeffHF37LKwQ2RFSPAKUuec4rd0p_7t0Bf1p9Gz42xVrSPd5LfbGpha2xXWL9x0uZFeq2eT0aVkBtLzVuMj8X2kYZqGTVv4VAJpkol2-aqUF9r-BNhfjanGR4PdV4D5mXbZTzPg6uPV7_uzBSxplwxHpXD0oOCVcWB3VCzKEv_FrBKL4hhK7tRiBwxWbdaO1y5WmvxQ7FBGDkezxKwqWLwbLmU14ELIhDU_ur8QqXZO_1KYM',
        selectedModifiers: []
      },
      {
        id: 'item-21',
        menuItemId: 'yuca-frita',
        name: 'Yuca Frita Crocante (L)',
        basePrice: 12000,
        totalUnitPrice: 12000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
        selectedModifiers: []
      }
    ],
    subtotal: 120000,
    tax: 9900,
    discount: 0,
    tip: 12000,
    total: 141900,
    status: 'completed',
    createdAt: '2026-08-23T15:50:00Z',
    paymentMethod: 'cash',
    paidAmount: 150000,
    change: 8100,
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
  companyName: 'Asadero & Restaurante El Remix S.A.S.',
  nit: '901.482.910-4',
  address: 'Calle 100 # 15-45, Zona Gastronómica',
  phone: '+57 (601) 745-9000',
  email: 'contacto@asaderoelremix.com',
  regimenFiscal: 'Régimen Común - Impuesto Nacional al Consumo',
  posResolutionNumber: '18764039201948',
  posResolutionPrefix: 'POS-',
  posResolutionRange: '1001 al 50000',
  posResolutionDate: '2026-01-15',
  impuestoConsumoPercent: 8,
  ivaPercent: 19,
  enableLoyaltyProgram: true,
  pointsPer1000Cop: 1,
  receiptHeaderMsg: '¡El mejor pollo al carbón con sabor artesanal!',
  receiptFooterMsg: 'Gracias por su preferencia. Propina sugerida 10%.'
};
