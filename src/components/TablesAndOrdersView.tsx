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
  const [viewMode, setViewMode] = useState<'tables' | 'kds'>('tables');
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
      className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:p-6 gap-5 bg-[#131313] select-none"
    >
      {/* Top View Mode Switcher (Plano de Mesas vs Cocina KDS) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-[#202020] p-1 rounded-xl border border-[#5b403d]/40">
          <button
            onClick={() => setViewMode('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'tables'
                ? 'bg-[#d32f2f] text-white shadow'
                : 'text-[#e4beba]/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">table_restaurant</span>
            <span>Plano de Mesas</span>
          </button>
          <button
            onClick={() => setViewMode('kds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kds'
                ? 'bg-[#d32f2f] text-white shadow'
                : 'text-[#e4beba]/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">soup_kitchen</span>
            <span>Comandas / Cocina (KDS)</span>
          </button>
        </div>

        {/* Areas / Status Quick Filters */}
        {viewMode === 'tables' && (
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Principal', 'Terraza', 'Barra'] as const).map((area) => (
              <button
                key={area}
                onClick={() => setAreaFilter(area)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  areaFilter === area
                    ? 'bg-[#f8bd2a] text-[#402d00] border-[#f8bd2a]'
                    : 'bg-[#202020] text-[#e4beba] border-[#5b403d]/30 hover:bg-[#2a2a2a]'
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#202020] rounded-2xl p-4 border border-[#5b403d]/40 shadow-sm gap-3 shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Salón Principal & Terrazas
              </h2>
              <p className="text-xs text-[#e4beba]/70 mt-0.5">
                Selecciona una mesa para tomar comandas, consultar cuenta o liberar espacio.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div
                onClick={() => setStatusFilter(statusFilter === 'available' ? 'All' : 'available')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#7ddc7a] border border-[#00390a]"></span>
                <span className="text-xs font-bold text-[#e4beba]">
                  Libres ({availableCount})
                </span>
              </div>
              <div
                onClick={() => setStatusFilter(statusFilter === 'occupied' ? 'All' : 'occupied')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#d32f2f] border border-[#ffdad6]"></span>
                <span className="text-xs font-bold text-[#e4beba]">
                  Ocupadas ({occupiedCount})
                </span>
              </div>
              <div
                onClick={() => setStatusFilter(statusFilter === 'payment_pending' ? 'All' : 'payment_pending')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#f8bd2a] border border-[#533c00]"></span>
                <span className="text-xs font-bold text-[#e4beba]">
                  Por Cobrar ({paymentPendingCount})
                </span>
              </div>
            </div>
          </div>

          {/* Tables Floor Plan Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
            {filteredTables.map((table) => {
              const isAvailable = table.status === 'available';
              const isOccupied = table.status === 'occupied';
              const isPayment = table.status === 'payment_pending';

              return (
                <div
                  key={table.id}
                  id={`table-card-${table.id}`}
                  className={`bg-[#202020] rounded-2xl p-4.5 flex flex-col justify-between h-[200px] border-2 transition-all relative overflow-hidden group ${
                    isAvailable
                      ? 'border-[#7ddc7a]/30 hover:border-[#7ddc7a] shadow-sm'
                      : isOccupied
                      ? 'border-[#d32f2f] shadow-[0_0_16px_rgba(211,47,47,0.2)] bg-gradient-to-b from-[#202020] to-[#2a1b1b]'
                      : 'border-[#f8bd2a] shadow-[0_0_16px_rgba(248,189,42,0.2)]'
                  }`}
                >
                  {/* Table Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xl font-black text-white tracking-tight">
                        {table.name}
                      </span>
                      <span className="text-[10px] text-[#e4beba]/60 block uppercase font-bold">
                        {table.area} • Cap {table.capacity}p
                      </span>
                    </div>

                    {/* Status Pill */}
                    {isAvailable && (
                      <span className="bg-[#7ddc7a] text-[#00390a] font-black text-[11px] px-2.5 py-0.5 rounded-full">
                        Libre
                      </span>
                    )}
                    {isOccupied && (
                      <span className="bg-[#d32f2f] text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        Ocupada
                      </span>
                    )}
                    {isPayment && (
                      <span className="bg-[#f8bd2a] text-[#402d00] font-black text-[11px] px-2.5 py-0.5 rounded-full animate-bounce">
                        Cuenta
                      </span>
                    )}
                  </div>

                  {/* Middle Table Details or Chair visual */}
                  {isAvailable ? (
                    <div className="my-auto flex justify-center items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-5xl text-[#7ddc7a]">
                        chair
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#e4beba]">
                        <span className="material-symbols-outlined text-sm text-[#ffb3ac]">
                          group
                        </span>
                        <span>{table.guestCount || 4} Personas</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#e4beba]">
                        <span className="material-symbols-outlined text-sm text-[#f8bd2a]">
                          schedule
                        </span>
                        <span>{table.elapsedMinutes || 30} min</span>
                      </div>
                      {table.serverName && (
                        <div className="text-[11px] text-[#e4beba]/70">
                          Mesero: {table.serverName}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex gap-2 pt-2 border-t border-[#5b403d]/30">
                    {isAvailable ? (
                      <button
                        onClick={() => {
                          setSeatingModalTable(table);
                          setGuestCountInput(table.capacity);
                        }}
                        className="flex-1 py-2 bg-[#2a2a2a] hover:bg-[#7ddc7a] hover:text-[#00390a] text-white font-bold text-xs rounded-xl border border-[#5b403d]/40 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        <span>Ocupar</span>
                      </button>
                    ) : isOccupied ? (
                      <>
                        <button
                          onClick={() => onSelectTable(table)}
                          className="flex-1 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                          <span>Comanda</span>
                        </button>
                        <button
                          onClick={() => onPayTable(table)}
                          className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#f8bd2a] hover:text-[#402d00] text-white font-bold text-xs rounded-xl border border-[#5b403d]/40 transition-all cursor-pointer"
                          title="Cobrar Mesa"
                        >
                          <span className="material-symbols-outlined text-sm">receipt</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onPayTable(table)}
                        className="flex-1 py-2 bg-[#f8bd2a] hover:bg-[#ffdfa0] text-[#402d00] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
            {orders.map((order) => {
              const isUrgent = order.status === 'pending';
              const isCooking = order.status === 'preparing';
              const isReady = order.status === 'ready';

              return (
                <div
                  key={order.id}
                  className={`bg-[#202020] rounded-2xl border-2 overflow-hidden flex flex-col shadow-xl ${
                    isUrgent
                      ? 'border-[#d32f2f]'
                      : isCooking
                      ? 'border-[#f8bd2a]'
                      : 'border-[#7ddc7a]'
                  }`}
                >
                  {/* Ticket Header */}
                  <div
                    className={`p-4 flex justify-between items-center text-white ${
                      isUrgent
                        ? 'bg-[#d32f2f]'
                        : isCooking
                        ? 'bg-[#d9a200] text-[#402d00]'
                        : 'bg-[#20812c]'
                    }`}
                  >
                    <div>
                      <h3 className="font-extrabold text-base">
                        Orden #{order.orderNumber}
                      </h3>
                      <span className="text-xs opacity-90">
                        {order.tableName || 'Mesa'} • {order.customerName || 'Cliente'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-black/30 backdrop-blur-sm">
                      {order.status === 'pending'
                        ? '🚨 Urgente'
                        : order.status === 'preparing'
                        ? '🔥 En Horno'
                        : order.status === 'ready'
                        ? '✅ Listo'
                        : 'Completado'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 space-y-3">
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start border-b border-[#5b403d]/30 pb-2.5 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-bold text-white">
                            <span className="text-[#f8bd2a] mr-2 font-black">
                              {it.quantity}x
                            </span>
                            {it.name}
                          </p>
                          {it.selectedModifiers.length > 0 && (
                            <p className="text-xs text-[#e4beba]/70 ml-6">
                              {it.selectedModifiers.map((m) => m.name).join(', ')}
                            </p>
                          )}
                          {it.notes && (
                            <p className="text-xs text-[#ffb3ac] ml-6 font-semibold">
                              Nota: {it.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KDS Footer Action */}
                  <div className="p-3 bg-[#1b1c1c] border-t border-[#5b403d]/40 flex gap-2">
                    <button
                      onClick={() => onAdvanceOrderStatus(order.id)}
                      className="flex-1 py-2.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">
                        check_circle
                      </span>
                      <span>
                        {order.status === 'pending'
                          ? 'Mandar a Horno'
                          : order.status === 'preparing'
                          ? 'Marcar Listo'
                          : 'Marcar Servido / Despachado'}
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">
              Ocupar Mesa {seatingModalTable.name}
            </h3>
            <p className="text-xs text-[#e4beba]/70">
              Ingresa la cantidad de comensales para abrir la comanda.
            </p>

            <div className="flex items-center justify-between bg-[#1b1c1c] p-3 rounded-xl border border-[#5b403d]/40">
              <span className="text-xs font-bold text-white">Comensales:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuestCountInput(Math.max(1, guestCountInput - 1))}
                  className="w-8 h-8 rounded-lg bg-[#2a2a2a] text-white font-bold"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-[#f8bd2a]">
                  {guestCountInput}
                </span>
                <button
                  onClick={() => setGuestCountInput(guestCountInput + 1)}
                  className="w-8 h-8 rounded-lg bg-[#2a2a2a] text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSeatingModalTable(null)}
                className="flex-1 py-2.5 border border-[#5b403d] text-[#e4beba] rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSeatConfirm}
                className="flex-1 py-2.5 bg-[#d32f2f] text-white rounded-xl text-xs font-bold"
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
