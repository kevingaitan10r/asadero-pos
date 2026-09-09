import React, { useState } from 'react';
import { Table, Order, TableStatus } from '../types';

interface TablesAndOrdersViewProps {
  tables: Table[];
  orders: Order[];
  onSelectTable: (table: Table) => void;
  onSeatTable: (tableId: string, guestCount: number) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onPayTable: (table: Table) => void;
}

export const TablesAndOrdersView: React.FC<TablesAndOrdersViewProps> = ({
  tables,
  orders,
  onSelectTable,
  onSeatTable,
  onAdvanceOrderStatus,
  onPayTable
}) => {
  const [viewMode, setViewMode] = useState<'tables' | 'kds'>('kds');
  const [areaFilter, setAreaFilter] = useState<'All' | 'Principal' | 'Terraza' | 'Barra'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | TableStatus>('All');
  const [seatingModalTable, setSeatingModalTable] = useState<Table | null>(null);
  const [guestCountInput, setGuestCountInput] = useState<number>(2);

  // Filtered tables
  const filteredTables = tables.filter((t) => {
    if (areaFilter !== 'All' && t.area !== areaFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  // Table summary counts
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const paymentPendingCount = tables.filter(
    (t) => t.status === 'payment_pending'
  ).length;

  const handleSeatConfirm = () => {
    if (seatingModalTable) {
      onSeatTable(seatingModalTable.id, guestCountInput);
      setSeatingModalTable(null);
    }
  };

  return (
    <div
      id="tables-orders-workspace"
      className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:p-6 gap-5 bg-background select-none"
    >
      {/* Top View Mode Switcher (Plano de Mesas vs Cocina KDS) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-xl border border-border-subtle shadow-xs">
          <button
            onClick={() => setViewMode('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'tables'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">table_restaurant</span>
            <span>Plano de Mesas ({tables.length})</span>
          </button>
          <button
            onClick={() => setViewMode('kds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'kds'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">soup_kitchen</span>
            <span>Comandas / Cocina (KDS)</span>
            {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-amber-950 font-black rounded-full">
                {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}
              </span>
            )}
          </button>
        </div>

        {/* Areas / Status Quick Filters */}
        {viewMode === 'tables' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Principal', 'Terraza', 'Barra'] as const).map((area) => (
              <button
                key={area}
                onClick={() => setAreaFilter(area)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  areaFilter === area
                    ? 'bg-amber-400 text-amber-950 font-black shadow-sm'
                    : 'bg-surface text-slate-600 dark:text-slate-300 border border-border-subtle hover:bg-surface-hover'
                }`}
              >
                {area === 'All' ? 'Todas las Áreas' : area}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: FLOOR PLAN (Plano de Mesas) */}
      {viewMode === 'tables' && (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {/* Context Legend Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface rounded-2xl p-4 border border-border-subtle shadow-sm gap-3 shrink-0">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Salón Principal & Terrazas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Selecciona una mesa para tomar comandas, consultar cuenta o liberar espacio.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div
                onClick={() => setStatusFilter(statusFilter === 'available' ? 'All' : 'available')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
                  statusFilter === 'available'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-transparent hover:bg-surface-elevated text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold">
                  Libres ({availableCount})
                </span>
              </div>
              <div
                onClick={() => setStatusFilter(statusFilter === 'occupied' ? 'All' : 'occupied')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
                  statusFilter === 'occupied'
                    ? 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300'
                    : 'border-transparent hover:bg-surface-elevated text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span className="text-xs font-bold">
                  Ocupadas ({occupiedCount})
                </span>
              </div>
              <div
                onClick={() => setStatusFilter(statusFilter === 'payment_pending' ? 'All' : 'payment_pending')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
                  statusFilter === 'payment_pending'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                    : 'border-transparent hover:bg-surface-elevated text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold">
                  Por Cobrar ({paymentPendingCount})
                </span>
              </div>
            </div>
          </div>

          {/* Tables Floor Plan Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
            {filteredTables.map((table) => {
              const isAvailable = table.status === 'available';
              const isOccupied = table.status === 'occupied';
              const isPayment = table.status === 'payment_pending';

              return (
                <div
                  key={table.id}
                  id={`table-card-${table.id}`}
                  className={`bg-surface rounded-2xl p-4 flex flex-col justify-between min-h-[190px] border transition-all relative overflow-hidden group shadow-xs hover:shadow-md ${
                    isAvailable
                      ? 'border-emerald-500/30 hover:border-emerald-500'
                      : isOccupied
                      ? 'border-red-500/40 hover:border-red-500'
                      : 'border-amber-500/50 hover:border-amber-500'
                  }`}
                >
                  {/* Table Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {table.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                        {table.area} • Cap {table.capacity}p
                      </span>
                    </div>

                    {/* Status Pill */}
                    {isAvailable && (
                      <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Libre
                      </span>
                    )}
                    {isOccupied && (
                      <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        Ocupada
                      </span>
                    )}
                    {isPayment && (
                      <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                        Cuenta
                      </span>
                    )}
                  </div>

                  {/* Middle Table Details */}
                  {isAvailable ? (
                    <div className="my-auto flex justify-center items-center opacity-30 group-hover:opacity-80 transition-opacity">
                      <span className="material-symbols-outlined text-5xl text-emerald-500">
                        chair
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto space-y-1.5 bg-surface-elevated/70 p-2.5 rounded-xl border border-border-subtle">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-bold">
                        <span className="material-symbols-outlined text-sm text-red-500">
                          group
                        </span>
                        <span>{table.guestCount || 4} Comensales</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                        <span className="material-symbols-outlined text-sm text-amber-500">
                          schedule
                        </span>
                        <span>{table.elapsedMinutes || 25} min en mesa</span>
                      </div>
                      {table.serverName && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Mesero: {table.serverName}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border-subtle">
                    {isAvailable ? (
                      <button
                        onClick={() => {
                          setSeatingModalTable(table);
                          setGuestCountInput(table.capacity);
                        }}
                        className="flex-1 py-2 bg-surface-elevated hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-border-subtle transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        <span>Ocupar Mesa</span>
                      </button>
                    ) : isOccupied ? (
                      <>
                        <button
                          onClick={() => onSelectTable(table)}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                          <span>Comanda</span>
                        </button>
                        <button
                          onClick={() => onPayTable(table)}
                          className="px-3 py-2 bg-surface-elevated hover:bg-amber-400 hover:text-amber-950 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-border-subtle transition-all cursor-pointer"
                          title="Cobrar Mesa"
                        >
                          <span className="material-symbols-outlined text-sm">receipt</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onPayTable(table)}
                        className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span>Cobrar Ahora</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: KDS (Kitchen Display System) */}
      {viewMode === 'kds' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {orders.map((order) => {
              const isUrgent = order.status === 'pending';
              const isCooking = order.status === 'preparing';

              return (
                <div
                  key={order.id}
                  className={`bg-surface rounded-2xl border-2 overflow-hidden flex flex-col shadow-lg transition-all ${
                    isUrgent
                      ? 'border-red-500 shadow-red-500/10'
                      : isCooking
                      ? 'border-amber-500 shadow-amber-500/10'
                      : 'border-emerald-500 shadow-emerald-500/10'
                  }`}
                >
                  {/* Ticket Header */}
                  <div
                    className={`p-4 flex justify-between items-center text-white ${
                      isUrgent
                        ? 'bg-red-600'
                        : isCooking
                        ? 'bg-amber-500 text-amber-950'
                        : 'bg-emerald-600'
                    }`}
                  >
                    <div>
                      <h3 className="font-black text-base">
                        Orden #{order.orderNumber}
                      </h3>
                      <span className="text-xs opacity-90 font-medium">
                        {order.tableName || 'Mesa'} • {order.customerName || 'Cliente'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-black/25 backdrop-blur-xs">
                      {order.status === 'pending'
                        ? '🚨 Por Preparar'
                        : order.status === 'preparing'
                        ? '🔥 En Asador'
                        : order.status === 'ready'
                        ? '✅ Listo'
                        : 'Completado'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 space-y-3 bg-surface">
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start border-b border-border-subtle pb-2.5 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                            <span className="text-amber-600 dark:text-amber-400 mr-2 font-black">
                              {it.quantity}x
                            </span>
                            {it.name}
                          </p>
                          {it.selectedModifiers.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">
                              {it.selectedModifiers.map((m) => m.name).join(', ')}
                            </p>
                          )}
                          {it.notes && (
                            <p className="text-xs text-red-600 dark:text-red-400 ml-6 font-semibold">
                              Nota: {it.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KDS Footer Action */}
                  <div className="p-3 bg-surface-elevated border-t border-border-subtle flex gap-2">
                    <button
                      onClick={() => onAdvanceOrderStatus(order.id)}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <span className="material-symbols-outlined text-base">
                        check_circle
                      </span>
                      <span>
                        {order.status === 'pending'
                          ? 'Mandar a Asador'
                          : order.status === 'preparing'
                          ? 'Marcar como Listo'
                          : 'Marcar como Servido / Despachado'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Seating Table Modal */}
      {seatingModalTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Ocupar Mesa {seatingModalTable.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingresa la cantidad de comensales para abrir la comanda en el salón.
            </p>

            <div className="flex items-center justify-between bg-surface-elevated p-3 rounded-xl border border-border-subtle">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Comensales:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuestCountInput(Math.max(1, guestCountInput - 1))}
                  className="w-8 h-8 rounded-lg bg-surface text-slate-800 dark:text-white font-bold border border-border-subtle cursor-pointer hover:bg-surface-hover"
                >
                  -
                </button>
                <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                  {guestCountInput}
                </span>
                <button
                  onClick={() => setGuestCountInput(guestCountInput + 1)}
                  className="w-8 h-8 rounded-lg bg-surface text-slate-800 dark:text-white font-bold border border-border-subtle cursor-pointer hover:bg-surface-hover"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSeatingModalTable(null)}
                className="flex-1 py-2.5 border border-border-subtle text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-surface-hover cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSeatConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
              >
                Abrir Comanda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
