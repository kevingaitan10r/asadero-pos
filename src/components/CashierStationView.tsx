import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { formatCOP } from '../utils/formatters';
import { 
  Search, 
  Receipt, 
  Clock, 
  User, 
  Utensils, 
  Bike, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  PlusCircle,
  DollarSign
} from 'lucide-react';

interface CashierStationViewProps {
  orders: Order[];
  onChargeOrder: (order: Order) => void;
  onNewDirectSale: () => void;
  onCancelOrder?: (orderId: string) => void;
  serverName?: string;
}

export const CashierStationView: React.FC<CashierStationViewProps> = ({
  orders,
  onChargeOrder,
  onNewDirectSale,
  serverName = 'Caja Principal'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Estadísticas rápidas de caja hoy
  const stats = useMemo(() => {
    const todayOrders = orders;
    const completed = todayOrders.filter((o) => o.status === 'completed');
    const pending = todayOrders.filter((o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');

    const totalCollected = completed.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPending = pending.reduce((sum, o) => sum + (o.total || 0), 0);

    const cashCollected = completed
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const electronicCollected = totalCollected - cashCollected;

    return {
      completedCount: completed.length,
      pendingCount: pending.length,
      totalCollected,
      totalPending,
      cashCollected,
      electronicCollected
    };
  }, [orders]);

  // Filtrado de comandas
  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return orders.filter((o) => {
      // Filtro por pestaña de estado
      if (statusTab === 'pending') {
        if (o.status !== 'pending' && o.status !== 'preparing' && o.status !== 'ready') {
          return false;
        }
      } else if (statusTab === 'completed') {
        if (o.status !== 'completed') return false;
      }

      // Filtro por búsqueda de texto (Orden #, Mesa o Cliente)
      if (query) {
        const orderNumMatch = o.orderNumber.toString().includes(query.replace('#', ''));
        const tableMatch = (o.tableName || '').toLowerCase().includes(query);
        const customerMatch = (o.customerName || '').toLowerCase().includes(query);
        const serverMatch = (o.serverName || '').toLowerCase().includes(query);

        return orderNumMatch || tableMatch || customerMatch || serverMatch;
      }

      return true;
    });
  }, [orders, statusTab, searchQuery]);

  // Si no hay orden seleccionada o la actual desapareció, seleccionar la primera pendiente si existe
  React.useEffect(() => {
    if (selectedOrder) {
      const stillExists = orders.find((o) => o.id === selectedOrder.id);
      if (stillExists) {
        setSelectedOrder(stillExists);
      }
    } else if (filteredOrders.length > 0) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [orders, filteredOrders]);

  const getServiceBadge = (type: Order['type'], tableName?: string) => {
    switch (type) {
      case 'dine-in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-600/10 text-red-600 dark:text-red-400 border border-red-600/20">
            <Utensils size={13} />
            <span>{tableName || 'Comedor'}</span>
          </span>
        );
      case 'takeout':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <ShoppingBag size={13} />
            <span>Para Llevar</span>
          </span>
        );
      case 'delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Bike size={13} />
            <span>Domicilio</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'preparing':
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock size={12} />
            <span>Por Cobrar</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} />
            <span>Cobrada</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-500/15 text-slate-500 border border-slate-500/30">
            <span>Anulada</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden select-none">
      {/* 1. Header de Terminal de Caja & Métricas Rápidas */}
      <div className="bg-surface border-b border-border-subtle p-4 sm:px-6 shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
              <Receipt size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Terminal de Caja & Cobro
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  En Línea
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Estación de cobro de comandas enviadas por meseros y ventas en mostrador
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <div className="px-3.5 py-2 rounded-xl bg-surface-elevated border border-border-subtle shrink-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Pendientes
              </span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                {stats.pendingCount} <span className="text-xs font-semibold">({formatCOP(stats.totalPending)})</span>
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-surface-elevated border border-border-subtle shrink-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Cobrado Hoy
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCOP(stats.totalCollected)}
              </span>
            </div>

            <button
              onClick={onNewDirectSale}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle size={16} />
              <span>Nueva Venta Directa</span>
            </button>
          </div>
        </div>

        {/* 2. Barra de Búsqueda y Filtros de Estado */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por # Orden, Mesa o Cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-border-subtle rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-xl border border-border-subtle w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusTab('pending')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                statusTab === 'pending'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Pendientes de Pago</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusTab === 'pending' ? 'bg-white text-red-600' : 'bg-amber-500/20 text-amber-600'
              }`}>
                {stats.pendingCount}
              </span>
            </button>

            <button
              onClick={() => setStatusTab('completed')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                statusTab === 'completed'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Cobradas Hoy</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusTab === 'completed' ? 'bg-white text-red-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {stats.completedCount}
              </span>
            </button>

            <button
              onClick={() => setStatusTab('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Todas ({orders.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Canvas: Split List & Selected Order Detail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Grid / List of Orders */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {filteredOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-surface-elevated flex items-center justify-center text-slate-400 mb-3 border border-border-subtle">
                <Receipt size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {statusTab === 'pending' ? 'No hay comandas pendientes de cobro' : 'No se encontraron órdenes'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {statusTab === 'pending'
                  ? 'Cuando los meseros tomen un pedido desde su teléfono, aparecerá aquí de forma automática.'
                  : 'Prueba buscando con otro término o cambiando los filtros.'}
              </p>
              <button
                onClick={onNewDirectSale}
                className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>Tomar Venta en Mostrador</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const isPending = order.status === 'pending' || order.status === 'preparing' || order.status === 'ready';

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-surface-elevated border-red-600 ring-2 ring-red-600/20 shadow-lg'
                        : 'bg-surface hover:bg-surface-elevated/70 border-border-subtle hover:border-border-medium shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Card Header: Order Number, Service Type & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                            #{order.orderNumber}
                          </span>
                          {getServiceBadge(order.type, order.tableName)}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Customer / Table & Server */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white">
                          <User size={14} className="text-slate-400" />
                          <span className="truncate">
                            {order.customerName || order.tableName || 'Cliente en Salón'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Mesero: <strong className="text-slate-700 dark:text-slate-300">{order.serverName || 'General'}</strong></span>
                          <span>{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-surface-elevated/50 rounded-xl p-2 mb-3 border border-border-subtle/50 text-xs space-y-1 max-h-24 overflow-hidden">
                        {order.items.slice(0, 3).map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                            <span className="truncate pr-2 font-medium">
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono font-bold shrink-0">
                              {formatCOP(it.totalUnitPrice * it.quantity)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-[10px] text-slate-400 font-bold italic pt-0.5">
                            + {order.items.length - 3} platos más...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Total Price & Quick Action */}
                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                        <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                          {formatCOP(order.total)}
                        </span>
                      </div>

                      {isPending ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onChargeOrder(order);
                          }}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                        >
                          <span>Cobrar</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          <span>Pagada</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Order Deep Breakdown Panel */}
        {selectedOrder && (
          <div className="w-80 sm:w-96 bg-surface border-l border-border-subtle flex flex-col h-full shrink-0 shadow-xl">
            {/* Detail Header */}
            <div className="p-4 border-b border-border-subtle bg-surface-elevated/40 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    Orden #{selectedOrder.orderNumber}
                  </h3>
                  {getServiceBadge(selectedOrder.type, selectedOrder.tableName)}
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Cliente: <strong className="text-slate-900 dark:text-white">{selectedOrder.customerName || selectedOrder.tableName || 'Salón'}</strong></span>
                <span>Mesero: <strong>{selectedOrder.serverName || 'General'}</strong></span>
              </div>
            </div>

            {/* Items Breakdown List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Detalle de Productos ({selectedOrder.items.length})
              </span>

              <div className="divide-y divide-border-subtle">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-slate-800 dark:text-slate-200 font-mono font-black text-xs border border-border-subtle">
                          {item.quantity}x
                        </span>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </span>
                      </div>
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="pl-6 pt-1 space-y-0.5">
                          {item.selectedModifiers.map((mod, mIdx) => (
                            <p key={mIdx} className="text-[10px] text-slate-500 dark:text-slate-400">
                              + {mod.name}
                            </p>
                          ))}
                        </div>
                      )}
                      {item.notes && (
                        <p className="pl-6 text-[10px] text-amber-600 dark:text-amber-400 font-semibold italic">
                          Nota: {item.notes}
                        </p>
                      )}
                    </div>

                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white shrink-0">
                      {formatCOP(item.totalUnitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations & Primary Action */}
            <div className="p-4 bg-surface-elevated border-t border-border-subtle shadow-lg shrink-0 space-y-2.5">
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200">{formatCOP(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Descuento</span>
                    <span className="font-mono">-{formatCOP(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IVA / INC</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200">{formatCOP(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 dark:text-white border-t border-border-subtle pt-2">
                  <span className="font-black text-sm">Total a Cobrar</span>
                  <span className="font-mono text-xl font-black text-amber-600 dark:text-amber-400">
                    {formatCOP(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Action Button: Cobrar Orden */}
              {selectedOrder.status === 'pending' || selectedOrder.status === 'preparing' || selectedOrder.status === 'ready' ? (
                <button
                  onClick={() => onChargeOrder(selectedOrder)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <DollarSign size={18} />
                  <span>Cobrar Orden • {formatCOP(selectedOrder.total)}</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Esta orden ya fue cobrada y liquidada</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
