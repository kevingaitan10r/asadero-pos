import React, { useState } from 'react';
import { Supplier, PurchaseOrder, InventoryItem, PurchaseOrderItem } from '../types';
import { formatCOP } from '../utils/formatters';
import {
  Truck,
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  PackageCheck,
  Star,
  FileText,
  Search,
  Phone,
  Mail,
  UserCheck,
  X
} from 'lucide-react';

interface ProcurementViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  inventoryItems: InventoryItem[];
  onAddSupplier: (newSupplier: Supplier) => void;
  onCreatePurchaseOrder: (po: PurchaseOrder) => void;
  onReceivePurchaseOrder: (poId: string) => void;
}

export function ProcurementView({
  suppliers,
  purchaseOrders,
  inventoryItems,
  onAddSupplier,
  onCreatePurchaseOrder,
  onReceivePurchaseOrder
}: ProcurementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);

  // New PO Form state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([]);
  const [poNotes, setPoNotes] = useState('');

  // New Supplier Form state
  const [newSupName, setNewSupName] = useState('');
  const [newSupNit, setNewSupNit] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupCategory, setNewSupCategory] = useState<Supplier['category']>('carnes');

  // Add Item to PO
  const handleAddItemToPO = (invItemId: string) => {
    const item = inventoryItems.find((i) => i.id === invItemId);
    if (!item) return;

    if (poItems.some((pi) => pi.inventoryItemId === invItemId)) {
      alert('Este insumo ya fue agregado a la orden.');
      return;
    }

    setPoItems([
      ...poItems,
      {
        inventoryItemId: item.id,
        inventoryItemName: item.name,
        quantity: 10,
        unitCost: item.costPerUnit,
        unit: item.unit
      }
    ]);
  };

  const handleUpdatePOItemQty = (invItemId: string, qty: number) => {
    setPoItems(
      poItems.map((pi) =>
        pi.inventoryItemId === invItemId ? { ...pi, quantity: Math.max(1, qty) } : pi
      )
    );
  };

  const handleUpdatePOItemCost = (invItemId: string, cost: number) => {
    setPoItems(
      poItems.map((pi) =>
        pi.inventoryItemId === invItemId ? { ...pi, unitCost: Math.max(0, cost) } : pi
      )
    );
  };

  const handleRemovePOItem = (invItemId: string) => {
    setPoItems(poItems.filter((pi) => pi.inventoryItemId !== invItemId));
  };

  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || poItems.length === 0) {
      alert('Por favor selecciona un proveedor y al menos un producto.');
      return;
    }

    const sup = suppliers.find((s) => s.id === selectedSupplierId);
    const total = poItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

    const createdPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      poNumber: 'PO-2026-' + Math.floor(Math.random() * 900 + 100),
      supplierId: selectedSupplierId,
      supplierName: sup ? sup.name : 'Proveedor',
      items: poItems,
      totalAmount: total,
      status: 'ordered',
      createdDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      notes: poNotes
    };

    onCreatePurchaseOrder(createdPO);
    setIsNewPOModalOpen(false);
    setPoItems([]);
    setPoNotes('');
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupNit) {
      alert('Por favor completa el nombre y NIT del proveedor.');
      return;
    }

    const createdSup: Supplier = {
      id: 'sup-' + Date.now(),
      nit: newSupNit,
      name: newSupName,
      contactName: newSupContact || 'Contacto Comercial',
      phone: newSupPhone || '+57 300 000 0000',
      email: newSupEmail || 'proveedor@asadero.com',
      category: newSupCategory,
      rating: 5
    };

    onAddSupplier(createdSup);
    setIsNewSupplierModalOpen(false);
    setNewSupName('');
    setNewSupNit('');
    setNewSupContact('');
    setNewSupPhone('');
    setNewSupEmail('');
  };

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(
    (sup) =>
      sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.nit.includes(searchQuery)
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-background p-4 lg:p-6 overflow-hidden select-none">
      {/* Top Header & Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck size={24} className="text-amber-500" />
            Compras y Proveedores (ERP)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión de abastecimiento, órdenes de compra y carga directa a inventario
          </p>
        </div>

        {/* Action Buttons & SubTabs */}
        <div className="flex items-center gap-3">
          <div className="bg-surface-elevated p-1 rounded-xl border border-border-subtle flex items-center shadow-xs">
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeSubTab === 'orders'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Órdenes de Compra
            </button>
            <button
              onClick={() => setActiveSubTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeSubTab === 'suppliers'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Directorio Proveedores
            </button>
          </div>

          {activeSubTab === 'orders' ? (
            <button
              onClick={() => setIsNewPOModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus size={16} /> Nueva Orden PO
            </button>
          ) : (
            <button
              onClick={() => setIsNewSupplierModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus size={16} /> Registrar Proveedor
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
        <input
          type="text"
          placeholder={
            activeSubTab === 'orders'
              ? 'Buscar por N° de PO o Proveedor...'
              : 'Buscar proveedor por nombre, NIT o contacto...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface text-xs text-slate-900 dark:text-white rounded-xl border border-border-subtle focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Main Content View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeSubTab === 'orders' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPOs.map((po) => {
              const isReceived = po.status === 'received';

              return (
                <div
                  key={po.id}
                  className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {po.poNumber}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {po.supplierName}
                      </h3>
                    </div>
                    {isReceived ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Recibido
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock size={12} /> Enviado
                      </span>
                    )}
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Insumos Solicitados:
                    </span>
                    {po.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 bg-surface-elevated p-2 rounded-lg border border-border-subtle"
                      >
                        <span className="font-semibold truncate max-w-[180px]">
                          {item.inventoryItemName}
                        </span>
                        <div className="text-right">
                          <span className="font-black text-slate-900 dark:text-white font-mono">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-mono">
                            {formatCOP(item.unitCost)} / u
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {po.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-4 bg-surface-elevated p-2 rounded-xl border border-border-subtle">
                      "{po.notes}"
                    </p>
                  )}

                  {/* Footer Stats & Receive Action */}
                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Total Compra</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {formatCOP(po.totalAmount)}
                      </span>
                    </div>

                    {!isReceived && (
                      <button
                        onClick={() => onReceivePurchaseOrder(po.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      >
                        <PackageCheck size={16} /> Recibir en Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Suppliers Directory View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-elevated text-amber-700 dark:text-amber-400 border border-border-subtle">
                      {sup.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(sup.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white">{sup.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    NIT: {sup.nit}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-slate-400" />
                      <span>Contacto: {sup.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>Teléfono: {sup.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">Email: {sup.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verificado
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSupplierId(sup.id);
                      setIsNewPOModalOpen(true);
                      setActiveSubTab('orders');
                    }}
                    className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    + Crear Pedido PO
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Create New Purchase Order */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-surface-elevated border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-amber-500" />
                Crear Nueva Orden de Compra (PO)
              </h2>
              <button
                onClick={() => setIsNewPOModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePO} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Select Supplier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seleccionar Proveedor
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none focus:border-amber-500"
                >
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} (NIT: {sup.nit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Insumo to PO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agregar Insumos del Inventario
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItemToPO(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none focus:border-amber-500"
                >
                  <option value="">+ Selecciona insumo para pedir...</option>
                  {inventoryItems.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (Stock Actual: {inv.stockQuantity} {inv.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* PO Items Table */}
              {poItems.length > 0 && (
                <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface-elevated">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-surface text-slate-500 dark:text-slate-400 border-b border-border-subtle">
                        <th className="p-2.5">Insumo</th>
                        <th className="p-2.5">Cantidad</th>
                        <th className="p-2.5">Costo Unit.</th>
                        <th className="p-2.5">Subtotal</th>
                        <th className="p-2.5 text-right">Quitar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-slate-900 dark:text-white">
                      {poItems.map((item) => (
                        <tr key={item.inventoryItemId}>
                          <td className="p-2.5 font-semibold">{item.inventoryItemName}</td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdatePOItemQty(
                                  item.inventoryItemId,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 bg-surface text-slate-900 dark:text-white px-2 py-1 rounded border border-border-subtle text-xs font-bold"
                            />
                            <span className="ml-1 text-[10px] text-slate-500">{item.unit}</span>
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) =>
                                handleUpdatePOItemCost(
                                  item.inventoryItemId,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 bg-surface text-slate-900 dark:text-white px-2 py-1 rounded border border-border-subtle text-xs font-bold"
                            />
                          </td>
                          <td className="p-2.5 font-black text-amber-600 dark:text-amber-400 font-mono">
                            {formatCOP(item.quantity * item.unitCost)}
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemovePOItem(item.inventoryItemId)}
                              className="text-red-500 hover:text-red-400 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas u Observaciones del Pedido
                </label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="Ej: Entregar antes de las 10:00 AM en cámara fría."
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPOModalOpen(false)}
                  className="px-4 py-2 bg-surface-elevated text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-surface-hover border border-border-subtle cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer active:scale-95"
                >
                  Generar Orden de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create New Supplier */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 bg-surface-elevated border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={18} className="text-blue-500" />
                Registrar Nuevo Proveedor
              </h2>
              <button
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Razón Social / Nombre Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="Ej: Avícola del Sol S.A.S."
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NIT / Identificación Fiscal *
                </label>
                <input
                  type="text"
                  required
                  value={newSupNit}
                  onChange={(e) => setNewSupNit(e.target.value)}
                  placeholder="Ej: 900.111.222-3"
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Persona de Contacto
                </label>
                <input
                  type="text"
                  value={newSupContact}
                  onChange={(e) => setNewSupContact(e.target.value)}
                  placeholder="Ej: Pedro Martínez"
                  className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newSupCategory}
                    onChange={(e) => setNewSupCategory(e.target.value as any)}
                    className="w-full bg-surface-elevated text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-border-subtle focus:outline-none"
                  >
                    <option value="carnes">Carnes / Pollos</option>
                    <option value="verduras">Verduras</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="insumos">Insumos General</option>
                    <option value="empaques">Empaques</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-4 py-2 bg-surface-elevated text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-surface-hover border border-border-subtle cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer active:scale-95"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
