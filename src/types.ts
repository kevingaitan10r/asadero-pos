export type CategoryId = 'pollos' | 'combos' | 'alacarta' | 'sopas' | 'adiciones' | 'bebidas';

export type SubCategoryFilter = 'all' | 'spicy' | 'traditional' | 'combos' | 'individual' | 'familiar';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required?: boolean;
  maxSelection?: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  plu: string;
  name: string;
  description: string;
  price: number;
  categoryId: CategoryId;
  subCategory?: 'spicy' | 'traditional' | 'familiar' | 'individual';
  prepTime: string;
  image: string;
  isSpicy?: boolean;
  isPopular?: boolean;
  availableModifiers?: ModifierGroup[];
}

export interface CartItemModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique instance id in cart
  menuItemId: string;
  name: string;
  basePrice: number;
  totalUnitPrice: number;
  quantity: number;
  image: string;
  notes?: string;
  selectedModifiers: CartItemModifier[];
}

export type OrderType = 'dine-in' | 'takeout' | 'delivery';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: number;
  tableId?: string;
  tableName?: string;
  customerId?: string;
  customerName?: string;
  type: OrderType;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountReason?: string;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  paidAmount?: number;
  change?: number;
  serverName?: string;
  earnedPoints?: number;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliveryNotes?: string;
  deliveryDriver?: string;
}

export type TableStatus = 'available' | 'occupied' | 'payment_pending' | 'reserved';

export interface Table {
  id: string;
  name: string; // e.g. "T-01"
  area: 'Principal' | 'Terraza' | 'Barra';
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  activeOrder?: Order;
  guestCount?: number;
  elapsedMinutes?: number;
  serverName?: string;
}

// --- ACTIVE TABS FOR POS + ERP INTEGRAL ---
export type ActiveTab =
  | 'menu'
  | 'orders'
  | 'checkout'
  | 'inventory'
  | 'recipes'
  | 'procurement'
  | 'crm'
  | 'hr'
  | 'finances'
  | 'dashboard'
  | 'settings';

// --- INVENTORY TYPES ---
export type InventoryCategory = 'carnes' | 'verduras' | 'bebidas' | 'insumos' | 'empaques';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  stockQuantity: number;
  unit: 'unidades' | 'kg' | 'litros' | 'paquetes' | 'cajas';
  minStockThreshold: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

// --- FINANCES TYPES ---
export type ExpenseCategory = 'insumos' | 'servicios' | 'nomina' | 'mantenimiento' | 'otros';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
  supplier?: string;
}

// --- RECIPES & DISH COSTING (ESCANDALLOS - ERP) ---
export interface RecipeIngredient {
  inventoryItemId: string;
  inventoryItemName: string;
  quantityNeeded: number; // e.g. 1.0 for 1 chicken, 0.5 for 0.5 kg yuca
  unit: string;
  unitCost: number;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  ingredients: RecipeIngredient[];
  yieldServings: number;
  preparationNotes?: string;
}

// --- PROCUREMENT & SUPPLIERS (COMPRAS Y PROVEEDORES - ERP) ---
export type PurchaseOrderStatus = 'draft' | 'ordered' | 'received' | 'cancelled';

export interface Supplier {
  id: string;
  nit: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  category: InventoryCategory;
  rating: number; // 1 to 5
}

export interface PurchaseOrderItem {
  inventoryItemId: string;
  inventoryItemName: string;
  quantity: number;
  unitCost: number;
  unit: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdDate: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  notes?: string;
}

// --- STAFF & HR (PERSONAL Y TURNOS - ERP) ---
export type StaffRole = 'admin' | 'cajero' | 'parrillero' | 'mesero' | 'repartidor';
export type ShiftStatus = 'clocked_in' | 'clocked_out' | 'on_break';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  hourlyRate: number;
  shiftStatus: ShiftStatus;
  lastClockIn?: string;
  salesCount: number;
  totalSalesAmount: number;
  rating: number;
}

export interface ShiftRecord {
  id: string;
  staffId: string;
  staffName: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
}

// --- CRM & LOYALTY (CLIENTES Y FIDELIZACIÓN - ERP) ---
export type LoyaltyTier = 'Bronce' | 'Plata' | 'Oro' | 'VIP';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  favoriteDish?: string;
  loyaltyPoints: number;
  tier: LoyaltyTier;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
}

// --- ERP & FISCAL SETTINGS (CONFIGURACIÓN EMPRESARIAL Y DIAN) ---
export interface CompanySettings {
  companyName: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  regimenFiscal: string;
  posResolutionNumber: string;
  posResolutionPrefix: string;
  posResolutionRange: string;
  posResolutionDate: string;
  impuestoConsumoPercent: number; // e.g. 8%
  ivaPercent: number; // e.g. 19%
  enableLoyaltyProgram: boolean;
  pointsPer1000Cop: number;
  receiptHeaderMsg: string;
  receiptFooterMsg: string;
  adminPin: string; // 4-digit security PIN for ERP modules
}
