import React, { useState } from 'react';
import { InventoryItem, InventoryCategory } from '../types';
import { formatCOP } from '../utils/formatters';

interface InventoryViewProps {
  inventoryItems: InventoryItem[];
  onRestockItem: (itemId: string, addQuantity: number) => void;
  onAddNewItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventoryItems,
  onRestockItem,
  onAddNewItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'all'>('all');
  const [onlyLowStockFilter, setOnlyLowStockFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Item Form state
  const [newItemSku, setNewItemSku] = useState<string>('INS-' + Math.floor(100 + Math.random() * 900));
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('insumos');
  const [newItemQty, setNewItemQty] = useState<number>(20);
  const [newItemUnit, setNewItemUnit] = useState<InventoryItem['unit']>('kg');
  const [newItemMin, setNewItemMin] = useState<number>(10);
  const [newItemCost, setNewItemCost] = useState<number>(2500);
  const [newItemSupplier, setNewItemSupplier] = useState<string>('Distribuidora Central');

  // Stats
  const totalValuation = inventoryItems.reduce(
    (sum, item) => sum + item.stockQuantity * item.costPerUnit,
    0
  );
  const lowStockItems = inventoryItems.filter(
    (item) => item.stockQuantity <= item.minStockThreshold
  );

  // Category labels and icons
  const categories: { id: InventoryCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Todos los Insumos', icon: 'inventory_2' },
    { id: 'carnes', label: 'Carnes & Aves', icon: 'kebab_dining' },
    { id: 'verduras', label: 'Verduras & Vegetales', icon: 'nutrition' },
    { id: 'bebidas', label: 'Bebidas & Licores', icon: 'local_drink' },
    { id: 'insumos', label: 'Insumos & Especias', icon: 'skillet' },
    { id: 'empaques', label: 'Empaques & Desechables', icon: 'package_2' }
  ];

  // Filtering
  const filteredItems = inventoryItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    if (onlyLowStockFilter && item.stockQuantity > item.minStockThreshold) {
      return false;
    }

    return true;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockingItem && restockAmount > 0) {
      onRestockItem(restockingItem.id, restockAmount);
      setRestockingItem(null);
      setRestockAmount(10);
    }
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddNewItem({
      sku: newItemSku,
      name: newItemName,
      category: newItemCategory,
      stockQuantity: newItemQty,
      unit: newItemUnit,
      minStockThreshold: newItemMin,
      costPerUnit: newItemCost,
      supplier: newItemSupplier
    });

    // Reset form
    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemSku('INS-' + Math.floor(100 + Math.random() * 900));
  };

  return (
    <div
      id="inventory-workspace"
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 gap-6 bg-background select-none custom-scrollbar"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Gestión de Inventario & Insumos
            </h2>
            {lowStockItems.length > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-black bg-red-600 text-white rounded-full animate-pulse shadow-sm">
                ⚠️ {lowStockItems.length} Bajo Stock
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Control de existencias de insumos en tiempo real y alertas automáticas de reabastecimiento.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Registrar Nuevo Insumo</span>
        </button>
      </div>

      {/* KPI Cards Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Items */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Insumos</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{inventoryItems.length} SKU</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
        </div>

        {/* Card 2: Valoración Total */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Valoración Stock</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{formatCOP(totalValuation)}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
        </div>

        {/* Card 3: Alertas de Bajo Stock */}
        <div
          onClick={() => setOnlyLowStockFilter(!onlyLowStockFilter)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            lowStockItems.length > 0
              ? 'bg-red-500/10 border-red-500/40 hover:bg-red-500/15'
              : 'bg-surface border-border-subtle'
          }`}
        >
          <div>
            <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Bajo Stock Crítico</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{lowStockItems.length} Alertas</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
        </div>

        {/* Card 4: Proveedores Activos */}
        <div className="bg-surface p-4 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Proveedores</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {new Set(inventoryItems.map((i) => i.supplier)).size} Activos
            </h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border-subtle shadow-sm">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-amber-950 font-black shadow-sm'
                  : 'bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-surface-hover border border-border-subtle'
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Low Stock Filter & Search Input */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setOnlyLowStockFilter(!onlyLowStockFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyLowStockFilter
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-surface-elevated text-slate-600 dark:text-slate-300 border-border-subtle hover:bg-surface-hover'
            }`}
          >
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            <span>Alertas ({lowStockItems.length})</span>
          </button>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar insumo o SKU..."
              className="bg-surface-elevated border border-border-subtle focus:border-amber-500 text-slate-900 dark:text-white text-xs pl-8 pr-3 py-2 rounded-xl outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table / Grid */}
      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-sm flex-1 flex flex-col min-h-[350px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-elevated/60 text-slate-500 dark:text-slate-400 border-b border-border-subtle uppercase text-[11px] font-black tracking-wider">
                <th className="p-4">SKU / Insumo</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4">Mínimo Req.</th>
                <th className="p-4">Costo Unit.</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-slate-700 dark:text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    No se encontraron insumos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.stockQuantity <= item.minStockThreshold;
                  const isWarning =
                    !isLow && item.stockQuantity <= item.minStockThreshold * 1.3;
                  const stockPercent = Math.min(
                    100,
                    Math.round((item.stockQuantity / (item.minStockThreshold * 2)) * 100)
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-elevated/50 transition-colors ${
                        isLow ? 'bg-red-500/5 dark:bg-red-950/20' : ''
                      }`}
                    >
                      {/* SKU & Name */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">{item.name}</div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-surface-elevated px-1.5 py-0.5 rounded border border-border-subtle">
                          {item.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-1 bg-surface-elevated border border-border-subtle rounded-lg text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                          {item.category}
                        </span>
                      </td>

                      {/* Stock Quantity & Bar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm font-mono ${
                              isLow
                                ? 'text-red-600 dark:text-red-400'
                                : isWarning
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {item.stockQuantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded">
                              BAJO STOCK
                            </span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-28 h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1.5 border border-border-subtle">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow
                                ? 'bg-red-500'
                                : isWarning
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Min Threshold */}
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-semibold font-mono">
                        {item.minStockThreshold} {item.unit}
                      </td>

                      {/* Cost Per Unit */}
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {formatCOP(item.costPerUnit)}
                      </td>

                      {/* Total Valuation */}
                      <td className="p-4 font-black text-amber-600 dark:text-amber-400 font-mono">
                        {formatCOP(item.stockQuantity * item.costPerUnit)}
                      </td>

                      {/* Supplier */}
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                        {item.supplier}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setRestockingItem(item);
                            setRestockAmount(20);
                          }}
                          className="px-3 py-1.5 bg-surface-elevated hover:bg-amber-400 hover:text-amber-950 border border-border-subtle text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                          <span>Cargar Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Reabastecer Stock */}
      {restockingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-amber-500">
                  add_shopping_cart
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cargar Stock de Insumo</h3>
              </div>
              <button
                onClick={() => setRestockingItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-surface-elevated p-3 rounded-xl border border-border-subtle text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{restockingItem.name}</p>
              <p className="text-slate-500 dark:text-slate-400">SKU: {restockingItem.sku} • Proveedor: {restockingItem.supplier}</p>
              <p className="text-amber-600 dark:text-amber-400 font-bold">
                Stock Actual: {restockingItem.stockQuantity} {restockingItem.unit} (Mínimo: {restockingItem.minStockThreshold} {restockingItem.unit})
              </p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Cantidad a Agregar ({restockingItem.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 1)}
                  className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-3 rounded-xl font-bold text-base outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex justify-between items-center">
                <span>Nuevo Stock estimado:</span>
                <span className="font-black text-sm font-mono">
                  {restockingItem.stockQuantity + restockAmount} {restockingItem.unit}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockingItem(null)}
                  className="flex-1 py-3 bg-surface-elevated border border-border-subtle text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer hover:bg-surface-hover"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer active:scale-95"
                >
                  Confirmar Reabastecimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Nuevo Insumo */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">add_circle</span>
                Registrar Nuevo Insumo de Inventario
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">SKU:</label>
                  <input
                    type="text"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Categoría:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none capitalize"
                  >
                    <option value="carnes">Carnes & Aves</option>
                    <option value="verduras">Verduras & Vegetales</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="insumos">Insumos & Especias</option>
                    <option value="empaques">Empaques & Desechables</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre del Insumo:</label>
                <input
                  type="text"
                  placeholder="Ej. Sal Marina Ahumada 10kg"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Stock Inicial:</label>
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Unidad:</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as InventoryItem['unit'])}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="unidades">unidades</option>
                    <option value="litros">litros</option>
                    <option value="paquetes">paquetes</option>
                    <option value="cajas">cajas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Mínimo Req.:</label>
                  <input
                    type="number"
                    value={newItemMin}
                    onChange={(e) => setNewItemMin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Costo Unitario ($ COP):</label>
                  <input
                    type="number"
                    step="100"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Proveedor:</label>
                  <input
                    type="text"
                    value={newItemSupplier}
                    onChange={(e) => setNewItemSupplier(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-surface-elevated border border-border-subtle text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer hover:bg-surface-hover"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer active:scale-95"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
