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
  const [newItemCost, setNewItemCost] = useState<number>(2.50);
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
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Low stock filter
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
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 gap-6 bg-[#131313] select-none custom-scrollbar"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Gestión de Inventario & Insumos
            </h2>
            {lowStockItems.length > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-[#d32f2f] text-white rounded-full animate-pulse border border-[#ffb3ac]/40">
                ⚠️ {lowStockItems.length} Alertas de Bajo Stock
              </span>
            )}
          </div>
          <p className="text-xs text-[#e4beba]/70 mt-0.5">
            Control de existencias de insumos en tiempo real y alertas automáticas de reabastecimiento.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs rounded-xl shadow-lg border border-[#ffb3ac]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Registrar Nuevo Insumo</span>
        </button>
      </div>

      {/* KPI Cards Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Items */}
        <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Total Insumos</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{inventoryItems.length} SKU</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#5b403d]/40 flex items-center justify-center text-[#f8bd2a]">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
        </div>

        {/* Card 2: Valoración Total */}
        <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Valoración Stock</p>
            <h3 className="text-2xl font-extrabold text-[#f8bd2a] mt-1">{formatCOP(totalValuation)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#5b403d]/40 flex items-center justify-center text-[#7ddc7a]">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
        </div>

        {/* Card 3: Alertas de Bajo Stock */}
        <div
          onClick={() => setOnlyLowStockFilter(!onlyLowStockFilter)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-md ${
            lowStockItems.length > 0
              ? 'bg-[#d32f2f]/15 border-[#d32f2f] hover:bg-[#d32f2f]/25'
              : 'bg-[#202020] border-[#5b403d]/40'
          }`}
        >
          <div>
            <p className="text-xs text-[#ffb3ac] font-semibold uppercase tracking-wider">Bajo Stock Crítico</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{lowStockItems.length} Alertas</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d32f2f]/20 border border-[#d32f2f]/50 flex items-center justify-center text-[#ffb3ac]">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
        </div>

        {/* Card 4: Proveedores Activos */}
        <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Proveedores</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {new Set(inventoryItems.map((i) => i.supplier)).size} Activos
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#5b403d]/40 flex items-center justify-center text-[#ffb3ac]">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#1b1c1c] p-3 rounded-2xl border border-[#5b403d]/40">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#d32f2f] text-white border border-[#ffb3ac]/50 shadow'
                  : 'bg-[#2a2a2a] text-[#e4beba]/70 hover:text-white border border-[#5b403d]/30'
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
                ? 'bg-[#d32f2f] text-white border-red-400'
                : 'bg-[#202020] text-[#ffb3ac] border-[#5b403d]/40 hover:bg-[#2a2a2a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            <span>Ver Solo Alertas ({lowStockItems.length})</span>
          </button>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#e4beba]/60">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar insumo o SKU..."
              className="bg-[#2a2a2a] border border-[#5b403d]/40 focus:border-[#f8bd2a] text-white text-xs pl-8 pr-3 py-2 rounded-xl outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table / Grid */}
      <div className="bg-[#1b1c1c] rounded-2xl border border-[#5b403d]/40 overflow-hidden shadow-xl flex-1 flex flex-col min-h-[350px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#202020] text-[#e4beba]/80 border-b border-[#5b403d]/40 uppercase text-[11px] font-bold tracking-wider">
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
            <tbody className="divide-y divide-[#5b403d]/30 text-[#e5e2e1]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#e4beba]/50 font-medium">
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
                      className={`hover:bg-[#252525] transition-colors ${
                        isLow ? 'bg-[#d32f2f]/10' : ''
                      }`}
                    >
                      {/* SKU & Name */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <span className="text-[10px] font-mono text-[#e4beba]/60 bg-[#2a2a2a] px-1.5 py-0.5 rounded">
                          {item.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-1 bg-[#2a2a2a] border border-[#5b403d]/30 rounded-lg text-[#e4beba] text-[11px] font-semibold">
                          {item.category}
                        </span>
                      </td>

                      {/* Stock Quantity & Bar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${
                              isLow
                                ? 'text-[#ffb3ac]'
                                : isWarning
                                ? 'text-[#f8bd2a]'
                                : 'text-[#7ddc7a]'
                            }`}
                          >
                            {item.stockQuantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 bg-[#d32f2f] text-white text-[10px] font-extrabold rounded">
                              BAJO STOCK
                            </span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-28 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow
                                ? 'bg-[#d32f2f]'
                                : isWarning
                                ? 'bg-[#f8bd2a]'
                                : 'bg-[#7ddc7a]'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Min Threshold */}
                      <td className="p-4 text-[#e4beba]/70 font-semibold">
                        {item.minStockThreshold} {item.unit}
                      </td>

                      {/* Cost Per Unit */}
                      <td className="p-4 font-bold text-[#e5e2e1]">
                        {formatCOP(item.costPerUnit)}
                      </td>

                      {/* Total Valuation */}
                      <td className="p-4 font-extrabold text-[#f8bd2a]">
                        {formatCOP(item.stockQuantity * item.costPerUnit)}
                      </td>

                      {/* Supplier */}
                      <td className="p-4 text-xs text-[#e4beba]/70 truncate max-w-[150px]">
                        {item.supplier}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setRestockingItem(item);
                            setRestockAmount(20);
                          }}
                          className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#353535] border border-[#5b403d]/40 text-[#f8bd2a] hover:text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#5b403d]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#f8bd2a]">
                  add_shopping_cart
                </span>
                <h3 className="font-bold text-white text-lg">Cargar Stock de Insumo</h3>
              </div>
              <button
                onClick={() => setRestockingItem(null)}
                className="text-[#e4beba]/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#1b1c1c] p-3 rounded-xl border border-[#5b403d]/30 text-xs space-y-1">
              <p className="font-bold text-white text-sm">{restockingItem.name}</p>
              <p className="text-[#e4beba]/70">SKU: {restockingItem.sku} • Proveedor: {restockingItem.supplier}</p>
              <p className="text-[#f8bd2a] font-bold">
                Stock Actual: {restockingItem.stockQuantity} {restockingItem.unit} (Mínimo: {restockingItem.minStockThreshold} {restockingItem.unit})
              </p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Cantidad a Agregar ({restockingItem.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-3 rounded-xl font-bold text-base outline-none focus:border-[#f8bd2a]"
                />
              </div>

              <div className="p-3 bg-[#20812c]/10 border border-[#20812c]/30 rounded-xl text-xs text-[#dbffd3] flex justify-between items-center">
                <span>Nuevo Stock estimado:</span>
                <span className="font-extrabold text-sm">
                  {restockingItem.stockQuantity + restockAmount} {restockingItem.unit}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockingItem(null)}
                  className="flex-1 py-3 bg-[#2a2a2a] text-[#e4beba] rounded-xl font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-xl font-bold text-xs shadow-lg"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#5b403d]/40">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f8bd2a]">add_circle</span>
                Registrar Nuevo Insumo de Inventario
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#e4beba]/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">SKU:</label>
                  <input
                    type="text"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Categoría:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none capitalize"
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
                <label className="block text-xs font-bold text-[#e4beba] mb-1">Nombre del Insumo:</label>
                <input
                  type="text"
                  placeholder="Ej. Sal Marina Ahumada 10kg"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none focus:border-[#f8bd2a]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Stock Inicial:</label>
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Unidad:</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as InventoryItem['unit'])}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="unidades">unidades</option>
                    <option value="litros">litros</option>
                    <option value="paquetes">paquetes</option>
                    <option value="cajas">cajas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Mínimo Req.:</label>
                  <input
                    type="number"
                    value={newItemMin}
                    onChange={(e) => setNewItemMin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Costo Unitario ($):</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Proveedor:</label>
                  <input
                    type="text"
                    value={newItemSupplier}
                    onChange={(e) => setNewItemSupplier(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-[#2a2a2a] text-[#e4beba] rounded-xl font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-xl font-bold text-xs shadow-lg"
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
