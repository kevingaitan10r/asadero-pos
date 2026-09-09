import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { formatCOP } from '../utils/formatters';
import {
  TrendingUp,
  Receipt,
  DollarSign,
  Utensils,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface DashboardViewProps {
  orders: Order[];
  onOpenCloseDay: () => void;
  onViewReceipt?: (order: Order) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  onOpenCloseDay,
  onViewReceipt
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [activeHourlyBar, setActiveHourlyBar] = useState<number | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'card' | 'transfer'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<Order | null>(null);

  // Dynamic calculations from completed/active orders
  const totalSalesBase = 8500000;
  const currentOrdersTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSales = totalSalesBase + currentOrdersTotal;

  const ordersCountBase = 142;
  const ordersCount = ordersCountBase + orders.length;
  const averageTicket = totalSales / (ordersCount || 1);

  // Hourly sales data
  const hourlyData = [
    { hour: '11:00 AM', amount: 320000, height: '28%', count: 8 },
    { hour: '12:00 PM', amount: 850000, height: '52%', count: 18 },
    { hour: '1:00 PM', amount: 2450000, height: '95%', count: 42, isPeak: true },
    { hour: '2:00 PM', amount: 1200000, height: '60%', count: 26 },
    { hour: '3:00 PM', amount: 680000, height: '38%', count: 14 },
    { hour: '4:00 PM', amount: 450000, height: '25%', count: 9 },
    { hour: '5:00 PM', amount: 510000, height: '32%', count: 12 },
    { hour: '6:00 PM', amount: 1600000, height: '72%', count: 29, isSecondary: true },
    { hour: '7:00 PM', amount: 1980000, height: '82%', count: 37 },
    { hour: '8:00 PM', amount: 990000, height: '48%', count: 19 }
  ];

  const topSelling = [
    {
      id: 1,
      name: 'Pollo Frito',
      category: 'Pollos',
      sold: 48,
      revenue: 1680000,
      percentage: 95,
      image:
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Combo Broster (1.5L)',
      category: 'Combos',
      sold: 34,
      revenue: 1598000,
      percentage: 85,
      image:
        'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Churrasco',
      category: 'A la Carta',
      sold: 28,
      revenue: 868000,
      percentage: 72,
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Ajiaco Santafereño',
      category: 'Sopas',
      sold: 36,
      revenue: 396000,
      percentage: 78,
      image:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Retrieve transactions list
  const transactionsList = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [orders]);

  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((tx) => {
      const matchPayment = paymentFilter === 'all' || tx.paymentMethod === paymentFilter;
      const search = searchQuery.toLowerCase().trim();
      const matchSearch =
        !search ||
        tx.orderNumber.toString().includes(search) ||
        (tx.tableName && tx.tableName.toLowerCase().includes(search)) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(search));
      return matchPayment && matchSearch;
    });
  }, [transactionsList, paymentFilter, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background space-y-6 custom-scrollbar select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Clean Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-5 sm:p-6 rounded-2xl border border-border-subtle shadow-xs">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Panel Gerencial & Analíticas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              MAXI Pollos 22 • Resumen consolidado del turno actual
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Switcher */}
            <div className="flex bg-surface-elevated p-1 rounded-2xl border border-border-subtle">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-red-600 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Métricas
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'transactions'
                    ? 'bg-red-600 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Transacciones</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-surface text-slate-900 dark:text-white font-black">
                  {transactionsList.length}
                </span>
              </button>
            </div>

            {/* Arqueo / Cierre Button */}
            <button
              onClick={onOpenCloseDay}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Lock size={14} />
              <span>Cierre de Caja</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* 4 Clean Metric Cards (Airy & Uncluttered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Ventas Totales */}
              <div className="bg-surface p-5 rounded-3xl border border-border-subtle shadow-xs hover:border-red-500/30 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ventas del Día
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <DollarSign size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {formatCOP(totalSales)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <TrendingUp size={13} />
                    <span>+12.4% vs ayer</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Pedidos */}
              <div className="bg-surface p-5 rounded-3xl border border-border-subtle shadow-xs hover:border-amber-500/30 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Comandas Atendidas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Receipt size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {ordersCount} pedidos
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                    <Clock size={13} />
                    <span>Pico: 1:00 PM (Almuerzo)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Ticket Promedio */}
              <div className="bg-surface p-5 rounded-3xl border border-border-subtle shadow-xs hover:border-red-500/30 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ticket Promedio
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {formatCOP(averageTicket)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                    <span>Margen bruto est: 68%</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Pollos Vendidos */}
              <div className="bg-surface p-5 rounded-3xl border border-border-subtle shadow-xs hover:border-purple-500/30 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Pollos Asados
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Utensils size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    86 Unidades
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <Sparkles size={13} />
                    <span>88% rotación de hornos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Middle Grid: Hourly Chart (Left) + Top Selling (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hourly Sales Bar Chart */}
              <div className="lg:col-span-2 bg-surface p-6 rounded-3xl border border-border-subtle shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Curva de Ventas por Horario
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Distribución de facturación a lo largo del turno
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Pico Almuerzo
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cena
                    </span>
                  </div>
                </div>

                {/* Bars Canvas */}
                <div className="relative min-h-[220px] flex items-end gap-2 sm:gap-3 pt-6 pb-2">
                  {hourlyData.map((d, index) => {
                    const isHovered = activeHourlyBar === index;
                    return (
                      <div
                        key={d.hour}
                        onMouseEnter={() => setActiveHourlyBar(index)}
                        onMouseLeave={() => setActiveHourlyBar(null)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative h-full justify-end"
                      >
                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-xl whitespace-nowrap z-20 pointer-events-none animate-in fade-in duration-150">
                            <div>{formatCOP(d.amount)}</div>
                            <div className="text-[10px] font-normal opacity-80">{d.count} comandas</div>
                          </div>
                        )}

                        {/* Bar */}
                        <div
                          style={{ height: d.height }}
                          className={`w-full rounded-t-xl transition-all duration-200 ${
                            d.isPeak
                              ? 'bg-gradient-to-t from-red-600 to-red-500 shadow-md shadow-red-500/20'
                              : d.isSecondary
                              ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-md shadow-amber-500/20'
                              : 'bg-surface-elevated group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                          }`}
                        />

                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate max-w-full">
                          {d.hour.split(':')[0]}
                          {d.hour.includes('PM') ? 'p' : 'a'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-surface p-6 rounded-3xl border border-border-subtle shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Más Vendidos
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Platillos estrella del asadero
                    </p>
                  </div>
                  <span className="text-xs font-black text-red-600 dark:text-red-400">
                    Top 4
                  </span>
                </div>

                <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                  {topSelling.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-elevated/60 hover:bg-surface-elevated transition-all border border-border-subtle"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 ml-2">
                            {item.sold} un.
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.percentage}%` }}
                            className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Methods Summary Breakdown */}
            <div className="bg-surface p-5 sm:p-6 rounded-3xl border border-border-subtle shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Recaudación por Medio de Pago
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cash */}
                <div className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        Efectivo (Caja)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">45% del total</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                      {formatCOP(totalSales * 0.45)}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        Datáfono / Tarjetas
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">35% del total</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                      {formatCOP(totalSales * 0.35)}
                    </span>
                  </div>
                </div>

                {/* Digital / Transfers */}
                <div className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        Nequi / Daviplata
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">20% del total</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                      {formatCOP(totalSales * 0.2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* TAB 2: TRANSACTIONS FEED (CLEAN & SPACIOUS) */
          <div className="bg-surface p-5 sm:p-6 rounded-3xl border border-border-subtle shadow-xs space-y-4">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por orden, mesa o cliente..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-elevated rounded-xl border border-border-subtle text-xs text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              {/* Payment Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto">
                {(['all', 'cash', 'card', 'transfer'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentFilter(method)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentFilter === method
                        ? 'bg-red-600 text-white font-black shadow-xs'
                        : 'bg-surface-elevated text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {method === 'all' && 'Todos'}
                    {method === 'cash' && 'Efectivo'}
                    {method === 'card' && 'Datáfono'}
                    {method === 'transfer' && 'Transferencia'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Table */}
            <div className="overflow-x-auto rounded-2xl border border-border-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-elevated text-slate-500 dark:text-slate-400 uppercase tracking-wider font-black text-[10px] border-b border-border-subtle">
                  <tr>
                    <th className="py-3 px-4">Orden</th>
                    <th className="py-3 px-4">Hora</th>
                    <th className="py-3 px-4">Cliente / Mesa</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        No se encontraron transacciones registradas.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-surface-elevated/70 transition-colors"
                      >
                        <td className="py-3 px-4 font-black font-mono text-slate-900 dark:text-white">
                          #{tx.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {new Date(tx.createdAt).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {tx.customerName || 'Cliente Mostrador'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {tx.tableName || (tx.type === 'takeout' ? 'Para Llevar' : 'Domicilio')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              tx.paymentMethod === 'cash'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : tx.paymentMethod === 'card'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {tx.paymentMethod === 'cash'
                              ? 'Efectivo'
                              : tx.paymentMethod === 'card'
                              ? 'Datáfono'
                              : 'Transferencia'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black font-mono text-slate-900 dark:text-white">
                          {formatCOP(tx.total)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {onViewReceipt && (
                            <button
                              onClick={() => onViewReceipt(tx)}
                              className="px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                              title="Ver tiquete"
                            >
                              Ver Ticket
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
