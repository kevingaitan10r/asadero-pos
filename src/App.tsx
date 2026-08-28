import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveTab,
  MenuItem,
  CartItem,
  CartItemModifier,
  Order,
  OrderType,
  Table,
  InventoryItem,
  Expense,
  Supplier,
  PurchaseOrder,
  Recipe,
  StaffMember,
  CustomerProfile,
  CompanySettings
} from './types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_EXPENSES,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RECIPES,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS,
  INITIAL_COMPANY_SETTINGS
} from './data/mockData';
import { formatCOP } from './utils/formatters';
import { NavigationDrawer } from './components/NavigationDrawer';
import { TopAppBar } from './components/TopAppBar';
import { MenuView } from './components/MenuView';
import { BillSidebar } from './components/BillSidebar';
import { CheckoutView } from './components/CheckoutView';
import { TablesAndOrdersView } from './components/TablesAndOrdersView';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { FinancesView } from './components/FinancesView';
import { RecipeCostingView } from './components/RecipeCostingView';
import { ProcurementView } from './components/ProcurementView';
import { StaffManagementView } from './components/StaffManagementView';
import { CrmView } from './components/CrmView';
import { SettingsView } from './components/SettingsView';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CloseDayModal } from './components/CloseDayModal';
import { ReceiptModal } from './components/ReceiptModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('menu');

  // Hover & Drawer Pin State
  const [isNavPinned, setIsNavPinned] = useState<boolean>(false);
  const [isNavHovered, setIsNavHovered] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);

  // Core Data POS
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  // ERP State
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);

  // Active Cart State
  const [orderNumber, setOrderNumber] = useState<number>(4092);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [selectedTable, setSelectedTable] = useState<string>('Mesa 02');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('María Rodríguez');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [orderNote, setOrderNote] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial cart items in COP
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      menuItemId: 'pollo-entero',
      name: 'Pollo Entero',
      basePrice: 48000,
      totalUnitPrice: 48000,
      quantity: 2,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKG7OeffHF37LKwQ2RFSPAKUuec4rd0p_7t0Bf1p9Gz42xVrSPd5LfbGpha2xXWL9x0uZFeq2eT0aVkBtLzVuMj8X2kYZqGTVv4VAJpkol2-aqUF9r-BNhfjanGR4PdV4D5mXbZTzPg6uPV7_uzBSxplwxHpXD0oOCVcWB3VCzKEv_FrBKL4hhK7tRiBwxWbdaO1y5WmvxQ7FBGDkezxKwqWLwbLmU14ELIhDU_ur8QqXZO_1KYM',
      notes: 'Bien dorado',
      selectedModifiers: [
        {
          groupId: 'sauces',
          groupName: 'Salsas',
          optionId: 'aji-extra',
          name: 'Extra Ají Casero',
          price: 2000
        }
      ]
    },
    {
      id: 'cart-2',
      menuItemId: 'yuca-frita',
      name: 'Yuca Frita Crocante (L)',
      basePrice: 12000,
      totalUnitPrice: 12000,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
      selectedModifiers: []
    },
    {
      id: 'cart-3',
      menuItemId: 'inca-kola',
      name: 'Inca Kola (1.5L)',
      basePrice: 8000,
      totalUnitPrice: 8000,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
      selectedModifiers: []
    }
  ]);

  // Modals state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isCloseDayOpen, setIsCloseDayOpen] = useState<boolean>(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Cart operations
  const handleSelectItem = (item: MenuItem) => {
    if (item.availableModifiers && item.availableModifiers.length > 0) {
      setCustomizingItem(item);
    } else {
      const existing = cartItems.find(
        (ci) => ci.menuItemId === item.id && ci.selectedModifiers.length === 0
      );
      if (existing) {
        setCartItems(
          cartItems.map((ci) =>
            ci.id === existing.id ? { ...ci, quantity: ci.quantity + 1 } : ci
          )
        );
      } else {
        setCartItems([
          ...cartItems,
          {
            id: 'cart-' + Date.now(),
            menuItemId: item.id,
            name: item.name,
            basePrice: item.price,
            totalUnitPrice: item.price,
            quantity: 1,
            image: item.image,
            selectedModifiers: []
          }
        ]);
      }
    }
  };

  const handleAddCustomizedItem = (
    item: MenuItem,
    quantity: number,
    modifiers: CartItemModifier[],
    notes: string
  ) => {
    const modifiersTotal = modifiers.reduce((acc, m) => acc + m.price, 0);
    const unitPrice = item.price + modifiersTotal;

    if (editingCartItem) {
      setCartItems(
        cartItems.map((ci) =>
          ci.id === editingCartItem.id
            ? {
                ...ci,
                quantity,
                selectedModifiers: modifiers,
                totalUnitPrice: unitPrice,
                notes
              }
            : ci
        )
      );
      setEditingCartItem(null);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: 'cart-' + Date.now() + Math.random(),
          menuItemId: item.id,
          name: item.name,
          basePrice: item.price,
          totalUnitPrice: unitPrice,
          quantity,
          image: item.image,
          selectedModifiers: modifiers,
          notes
        }
      ]);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
    } else {
      setCartItems(
        cartItems.map((ci) =>
          ci.id === cartItemId ? { ...ci, quantity: newQty } : ci
        )
      );
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((ci) => ci.id !== cartItemId));
  };

  const handleEditItem = (cartItem: CartItem) => {
    const originalMenuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
    if (originalMenuItem) {
      setEditingCartItem(cartItem);
      setCustomizingItem(originalMenuItem);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Desea vaciar todos los productos de la orden actual?')) {
      setCartItems([]);
    }
  };

  // Table Selection & Seating
  const handleSelectTableFromFloor = (table: Table) => {
    setSelectedTable(table.name);
    setSelectedCustomer(table.serverName ? `Mesa de ${table.serverName}` : 'Comensal General');
    setActiveTab('menu');
  };

  const handleSeatTable = (tableId: string, guestCount: number) => {
    setTables(
      tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'occupied',
              guestCount,
              elapsedMinutes: 1,
              serverName: 'Carlos'
            }
          : t
      )
    );
    const targetTable = tables.find((t) => t.id === tableId);
    if (targetTable) {
      setSelectedTable(targetTable.name);
      setSelectedCustomer(`Grupo ${guestCount}p`);
      setActiveTab('menu');
    }
  };

  const handlePayTable = (table: Table) => {
    setSelectedTable(table.name);
    setSelectedCustomer(table.serverName ? `Mesa de ${table.serverName}` : 'Comensal General');
    setActiveTab('checkout');
  };

  // Order status advance in KDS
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders(
      orders.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === 'pending') return { ...o, status: 'preparing' };
        if (o.status === 'preparing') return { ...o, status: 'ready' };
        if (o.status === 'ready') return { ...o, status: 'delivered' };
        return o;
      })
    );
  };

  // ERP Operations
  const handleRestockItem = (itemId: string, addQuantity: number) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stockQuantity: item.stockQuantity + addQuantity,
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
  };

  const handleAddNewInventoryItem = (
    newItem: Omit<InventoryItem, 'id' | 'lastRestocked'>
  ) => {
    const created: InventoryItem = {
      ...newItem,
      id: 'inv-' + Date.now(),
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setInventoryItems([created, ...inventoryItems]);
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const created: Expense = {
      ...newExpense,
      id: 'exp-' + Date.now()
    };
    setExpenses([created, ...expenses]);
  };

  // Recipe cost management
  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    const exists = recipes.some((r) => r.menuItemId === updatedRecipe.menuItemId);
    if (exists) {
      setRecipes(recipes.map((r) => (r.menuItemId === updatedRecipe.menuItemId ? updatedRecipe : r)));
    } else {
      setRecipes([...recipes, updatedRecipe]);
    }
  };

  // Procurement (PO) operations
  const handleAddSupplier = (newSup: Supplier) => {
    setSuppliers([...suppliers, newSup]);
  };

  const handleCreatePurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders([po, ...purchaseOrders]);
  };

  const handleReceivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    if (!window.confirm(`¿Confirmas la recepción de la orden ${po.poNumber}? Se actualizará el inventario y registrará el gasto.`)) {
      return;
    }

    // 1. Mark PO as received
    setPurchaseOrders(
      purchaseOrders.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'received',
              receivedDate: new Date().toISOString().split('T')[0]
            }
          : p
      )
    );

    // 2. Increase stock for received items
    setInventoryItems((prevInv) =>
      prevInv.map((inv) => {
        const poItem = po.items.find((item) => item.inventoryItemId === inv.id);
        if (poItem) {
          return {
            ...inv,
            stockQuantity: inv.stockQuantity + poItem.quantity,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return inv;
      })
    );

    // 3. Register financial expense automatically
    const autoExpense: Expense = {
      id: 'exp-po-' + Date.now(),
      title: `Recepción Orden Compra ${po.poNumber} (${po.supplierName})`,
      category: 'insumos',
      amount: po.totalAmount,
      date: new Date().toISOString().split('T')[0],
      supplier: po.supplierName,
      notes: po.notes || 'Ingreso automático por orden de compra ERP'
    };

    setExpenses((prevExpenses) => [autoExpense, ...prevExpenses]);
  };

  // Staff HR operations
  const handleToggleClockIn = (staffId: string) => {
    setStaffList(
      staffList.map((s) =>
        s.id === staffId
          ? {
              ...s,
              shiftStatus: s.shiftStatus === 'clocked_in' ? 'clocked_out' : 'clocked_in',
              lastClockIn:
                s.shiftStatus === 'clocked_out'
                  ? new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                  : s.lastClockIn
            }
          : s
      )
    );
  };

  const handleAddStaffMember = (newStaff: StaffMember) => {
    setStaffList([...staffList, newStaff]);
  };

  // CRM Operations
  const handleAddCustomer = (newCust: CustomerProfile) => {
    setCustomers([newCust, ...customers]);
  };

  const handleSelectCustomerForOrder = (cust: CustomerProfile) => {
    setSelectedCustomer(cust.name);
    setSelectedCustomerId(cust.id);
    setActiveTab('menu');
  };

  // Finish Order / Checkout
  const handleFinishOrder = (orderData: Partial<Order>) => {
    const pointsEarned = Math.floor((orderData.total || 0) / 1000);

    const finalOrder: Order = {
      id: 'ORD-' + orderNumber,
      orderNumber,
      tableName: selectedTable,
      customerId: selectedCustomerId,
      customerName: selectedCustomer,
      type: orderType,
      items: cartItems,
      subtotal: orderData.subtotal || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      tip: orderData.tip || 0,
      total: orderData.total || 0,
      status: 'completed',
      createdAt: new Date().toISOString(),
      paymentMethod: orderData.paymentMethod || 'cash',
      paidAmount: orderData.paidAmount,
      change: orderData.change,
      serverName: 'Carlos',
      earnedPoints: pointsEarned
    };

    setOrders([finalOrder, ...orders]);

    // Update customer CRM points if customer exists
    if (selectedCustomerId) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === selectedCustomerId
            ? {
                ...c,
                loyaltyPoints: c.loyaltyPoints + pointsEarned,
                totalSpent: c.totalSpent + (orderData.total || 0),
                orderCount: c.orderCount + 1,
                lastOrderDate: new Date().toISOString().split('T')[0]
              }
            : c
        )
      );
    }

    // Update sales performance for assigned staff member (Carlos)
    setStaffList((prevStaff) =>
      prevStaff.map((s) =>
        s.name === 'Carlos'
          ? {
              ...s,
              salesCount: s.salesCount + 1,
              totalSalesAmount: s.totalSalesAmount + (orderData.total || 0)
            }
          : s
      )
    );

    // Automatically deduct inventory stock for sold items using recipe BOM or fallback
    setInventoryItems((prevInventory) =>
      prevInventory.map((inv) => {
        let qtyToDeduct = 0;
        cartItems.forEach((ci) => {
          // Check recipe first
          const itemRecipe = recipes.find((r) => r.menuItemId === ci.menuItemId);
          if (itemRecipe) {
            const ing = itemRecipe.ingredients.find((i) => i.inventoryItemId === inv.id);
            if (ing) {
              qtyToDeduct += ing.quantityNeeded * ci.quantity;
            }
          } else {
            // Fallback keyword match
            if (
              ci.name.toLowerCase().includes('pollo') &&
              inv.name.toLowerCase().includes('pollo')
            ) {
              qtyToDeduct += ci.quantity;
            } else if (
              ci.name.toLowerCase().includes('yuca') &&
              inv.name.toLowerCase().includes('yuca')
            ) {
              qtyToDeduct += ci.quantity * 0.5;
            } else if (
              ci.name.toLowerCase().includes('inca') &&
              inv.name.toLowerCase().includes('inca')
            ) {
              qtyToDeduct += ci.quantity;
            }
          }
        });

        if (qtyToDeduct > 0) {
          return {
            ...inv,
            stockQuantity: Math.max(0, inv.stockQuantity - Math.round(qtyToDeduct))
          };
        }
        return inv;
      })
    );

    if (selectedTable) {
      setTables(
        tables.map((t) =>
          t.name === selectedTable
            ? { ...t, status: 'available', guestCount: undefined, elapsedMinutes: undefined }
            : t
        )
      );
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setReceiptOrder(finalOrder);
  };

  const handleStartNewOrder = () => {
    setOrderNumber((prev) => prev + 1);
    setCartItems([]);
    setDiscountPercent(0);
    setOrderNote('');
    setSelectedTable('Mesa 01');
    setSelectedCustomer('Comensal General');
    setSelectedCustomerId('');
    setActiveTab('menu');
  };

  const totalSalesAll = orders.reduce((sum, o) => sum + o.total, 8500000);

  const cartTotalAmount = cartItems.reduce(
    (sum, item) => sum + item.totalUnitPrice * item.quantity,
    0
  );
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const lowStockCount = inventoryItems.filter(
    (item) => item.stockQuantity <= item.minStockThreshold
  ).length;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#131313] text-[#e5e2e1] relative">
      {/* 1. Left Navigation Drawer (POS & ERP Unified) */}
      <NavigationDrawer
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
          setIsMobileNavOpen(false);
        }}
        onOpenCloseDay={() => setIsCloseDayOpen(true)}
        cartCount={cartTotalCount}
        pendingOrdersCount={orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length}
        lowStockCount={lowStockCount}
        isHovered={isNavHovered}
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        isPinned={isNavPinned}
        onTogglePin={() => setIsNavPinned(!isNavPinned)}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top App Bar */}
        <TopAppBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTableName={selectedTable}
          onSelectTableClick={() => setActiveTab('orders')}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isNavPinned={isNavPinned}
          onToggleNavPin={() => setIsNavPinned(!isNavPinned)}
        />

        {/* Tab Router */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeTab === 'menu' && (
            <>
              <MenuView
                menuItems={menuItems}
                cartItems={cartItems}
                onSelectItem={handleSelectItem}
                searchQuery={searchQuery}
              />

              <BillSidebar
                orderNumber={orderNumber}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                tableName={selectedTable}
                customerName={selectedCustomer}
                onSelectTable={() => setActiveTab('orders')}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onEditItem={handleEditItem}
                onProceedToPay={() => setActiveTab('checkout')}
                discountPercent={discountPercent}
                onApplyDiscount={setDiscountPercent}
                orderNote={orderNote}
                onSetOrderNote={setOrderNote}
                onClearCart={handleClearCart}
                isOpenMobileCart={isMobileCartOpen}
                onCloseMobileCart={() => setIsMobileCartOpen(false)}
              />
            </>
          )}

          {activeTab === 'orders' && (
            <TablesAndOrdersView
              tables={tables}
              orders={orders}
              onSelectTable={handleSelectTableFromFloor}
              onSeatTable={handleSeatTable}
              onAdvanceOrderStatus={handleAdvanceOrderStatus}
              onPayTable={handlePayTable}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckoutView
              orderNumber={orderNumber}
              orderType={orderType}
              tableName={selectedTable}
              customerName={selectedCustomer}
              items={cartItems}
              discountPercent={discountPercent}
              onFinishOrder={handleFinishOrder}
              onBackToMenu={() => setActiveTab('menu')}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              inventoryItems={inventoryItems}
              onRestockItem={handleRestockItem}
              onAddNewItem={handleAddNewInventoryItem}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipeCostingView
              menuItems={menuItems}
              inventoryItems={inventoryItems}
              recipes={recipes}
              onUpdateRecipe={handleUpdateRecipe}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementView
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              inventoryItems={inventoryItems}
              onAddSupplier={handleAddSupplier}
              onCreatePurchaseOrder={handleCreatePurchaseOrder}
              onReceivePurchaseOrder={handleReceivePurchaseOrder}
            />
          )}

          {activeTab === 'hr' && (
            <StaffManagementView
              staffList={staffList}
              onToggleClockIn={handleToggleClockIn}
              onAddStaffMember={handleAddStaffMember}
            />
          )}

          {activeTab === 'crm' && (
            <CrmView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onSelectCustomerForOrder={handleSelectCustomerForOrder}
            />
          )}

          {activeTab === 'finances' && (
            <FinancesView
              totalSales={totalSalesAll}
              expenses={expenses}
              onAddExpense={handleAddExpense}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              orders={orders}
              onOpenCloseDay={() => setIsCloseDayOpen(true)}
              onViewReceipt={(order) => setReceiptOrder(order)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={companySettings}
              onSaveSettings={setCompanySettings}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Floating Cart Bar */}
      {activeTab === 'menu' && cartTotalCount > 0 && (
        <div className="lg:hidden fixed bottom-4 right-4 left-4 z-30 animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full h-14 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-2xl shadow-2xl flex items-center justify-between px-5 font-bold text-sm border border-[#ffb3ac]/40 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#f8bd2a] text-[#402d00] font-black flex items-center justify-center text-xs shadow">
                {cartTotalCount}
              </span>
              <span>Ver Orden Actual</span>
            </div>
            <span className="text-lg font-black text-[#f8bd2a] tracking-tight">
              {formatCOP(cartTotalAmount * 1.0825)}
            </span>
          </button>
        </div>
      )}

      {/* 4. Global Modals */}
      {customizingItem && (
        <ItemCustomizerModal
          item={customizingItem}
          isOpen={!!customizingItem}
          onClose={() => {
            setCustomizingItem(null);
            setEditingCartItem(null);
          }}
          onAddToCart={handleAddCustomizedItem}
          initialQuantity={editingCartItem?.quantity || 1}
          initialModifiers={editingCartItem?.selectedModifiers || []}
          initialNotes={editingCartItem?.notes || ''}
        />
      )}

      <CloseDayModal
        isOpen={isCloseDayOpen}
        onClose={() => setIsCloseDayOpen(false)}
        totalSales={totalSalesAll}
        ordersCount={142 + orders.length}
      />

      <ReceiptModal
        order={receiptOrder}
        settings={companySettings}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
        onNewOrder={handleStartNewOrder}
      />
    </div>
  );
}
