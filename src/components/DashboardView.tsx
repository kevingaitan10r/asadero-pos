import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { formatCOP } from '../utils/formatters';

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
  
  // Transactions tab state
  const [selectedTransaction, setSelectedTransaction] = useState<Order | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'card' | 'transfer'>('all');
  const [transactionSearch, setTransactionSearch] = useState<string>('');

  // Dynamic calculations from completed/active orders
  const totalSalesBase = 8500000;
  const currentOrdersTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSales = totalSalesBase + currentOrdersTotal;

  const ordersCountBase = 142;
  const ordersCount = ordersCountBase + orders.length;

  const averageTicket = totalSales / (ordersCount || 1);

  // Hourly sales data
  const hourlyData = [
    { hour: '11a', amount: 320000, height: '30%', count: 8 },
    { hour: '12p', amount: 850000, height: '50%', count: 18 },
    { hour: '1p', amount: 2450000, height: '85%', count: 42, isPeak: true },
    { hour: '2p', amount: 1200000, height: '60%', count: 26 },
    { hour: '3p', amount: 680000, height: '40%', count: 14 },
    { hour: '4p', amount: 450000, height: '22%', count: 9 },
    { hour: '5p', amount: 510000, height: '35%', count: 12 },
    { hour: '6p', amount: 1600000, height: '70%', count: 29, isSecondary: true },
    { hour: '7p', amount: 1980000, height: '80%', count: 37 },
    { hour: '8p', amount: 990000, height: '45%', count: 19 }
  ];

  const topSelling = [
    {
      name: 'Cuarto de Pollo Asado',
      sold: 42,
      price: formatCOP(16000),
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUm-bvCBlYrBx5wJ1mshQYfTXskTY7FsxlznMJcC8r8C_GjdbQ35qOZHJGcmBDxwGpCJ2xRv5mm29n5iD8U0lcKJBUJZ97Q6V1-4HCfY9I33QQMQd0XgxohJ9HpTuWLRTNsT1Qksb47--Zq7-AbsCLZDRwte9Un25QAFiFaj6QAOcWL75QYgIn096ATAJfW1IJ9q45FHg0ob04vFfjLh7nIuSMSaBH2LSFLwR8WdbGVrEOdxGf1Rs'
    },
    {
      name: 'Combo Familiar Asadero',
      sold: 28,
      price: formatCOP(85000),
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAADN0Q6BM2WCgcYBmMsZylCjWSxFPLmhCgo6G6KzNtg0SwcO8zGQcsDSuQ3hyRtUNfnU6doPrA6m_8sWPljmtIJGMphmlC7My5hYbsBPpS4LqbebFeLNaHV6-VBDG6-3PRzB6SrgOA4eZA-xjxX427Agd3ioZWA0WHBkMgRcBuphOFoi1LbnDgDyHi2SIfzr07slZg9aPI72tdkRF67I5elToZCIy2Rw2bf0N2mmVtnIqZkG2R5yE'
    },
    {
      name: 'Combo Dúo Asado',
      sold: 19,
      price: formatCOP(48000),
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZE1wC2OcRWzDtRzP0cl3VVj2Xl68cFCpRxylq8Xlx0xuO6vuVr8C8j7PNDXw7CTP7x0HjoRJ2GP1fNlV4AkRxsubx5cFFLDKGz2KwdJTyMEUZKihdpbQ4s5Tb02QJdrKCsQB4kLDSiVtE3R8aZkdvpmxE72Z1yi5GqO3Hx5_0nKj5VAhH01o7ZFcyIsExp8N88RqqCnV4kEu2-zRsso7iynCRdDfHSWbyEkWPSFOz2dIAssXYmSY'
    },
    {
      name: 'Yuca Frita Crocante (L)',
      sold: 35,
      price: formatCOP(12000),
      image:
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Retrieve the last 10 processed transactions sorted by most recent
  const last10Transactions = useMemo(() => {
    // Sort all orders by createdAt descending
    const sorted = [...orders].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA;
    });
    return sorted.slice(0, 10);
  }, [orders]);

  // Filtered transactions for the view
  const filteredTransactions = useMemo(() => {
    return last10Transactions.filter((tx) => {
      const matchesPayment =
        paymentFilter === 'all' || tx.paymentMethod === paymentFilter;
      const searchLower = transactionSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        tx.id.toLowerCase().includes(searchLower) ||
        tx.orderNumber.toString().includes(searchLower) ||
        (tx.tableName && tx.tableName.toLowerCase().includes(searchLower)) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(searchLower)) ||
        tx.items.some((it) => it.name.toLowerCase().includes(searchLower));

      return matchesPayment && matchesSearch;
    });
  }, [last10Transactions, paymentFilter, transactionSearch]);

  // Aggregate stats for the last 10 transactions
  const txStats = useMemo(() => {
    const totalAmount = last10Transactions.reduce((acc, t) => acc + t.total, 0);
    const cashTotal = last10Transactions
      .filter((t) => t.paymentMethod === 'cash')
      .reduce((acc, t) => acc + t.total, 0);
    const cardTotal = last10Transactions
      .filter((t) => t.paymentMethod === 'card')
      .reduce((acc, t) => acc + t.total, 0);
    const transferTotal = last10Transactions
      .filter((t) => t.paymentMethod === 'transfer')
      .reduce((acc, t) => acc + t.total, 0);

    return {
      totalAmount,
      avgTicket: totalAmount / (last10Transactions.length || 1),
      cashTotal,
      cardTotal,
      transferTotal,
      cashCount: last10Transactions.filter((t) => t.paymentMethod === 'cash').length,
      cardCount: last10Transactions.filter((t) => t.paymentMethod === 'card').length,
      transferCount: last10Transactions.filter((t) => t.paymentMethod === 'transfer').length
    };
  }, [last10Transactions]);

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
        time: d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    } catch {
      return { date: 'Hoy', time: 'Reciente' };
    }
  };

  return (
    <div
      id="dashboard-workspace"
      className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#131313] space-y-6 custom-scrollbar select-none"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#5b403d]/30 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f8bd2a] text-2xl">
                analytics
              </span>
              <span>Panel Administrativo & Transacciones</span>
            </h2>
            <p className="text-xs text-[#e4beba]/70 mt-0.5">
              Métricas en tiempo real, arqueo y desglose de ventas • Estación 01
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Switcher Tabs */}
            <div className="flex bg-[#202020] p-1 rounded-xl border border-[#5b403d]/40">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#d32f2f] text-white shadow-md'
                    : 'text-[#e4beba]/70 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">monitoring</span>
                <span>Métricas Generales</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'transactions'
                    ? 'bg-[#d32f2f] text-white shadow-md'
                    : 'text-[#e4beba]/70 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                <span>Últimas 10 Transacciones</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    activeTab === 'transactions'
                      ? 'bg-black/30 text-white'
                      : 'bg-[#f8bd2a] text-[#402d00]'
                  }`}
                >
                  {last10Transactions.length}
                </span>
              </button>
            </div>

            <button
              onClick={onOpenCloseDay}
              className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span className="hidden md:inline">Cierre de Caja</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Summary Cards Bento (Total Sales, Orders Today, Average Ticket) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bento Card 1: Total Sales */}
              <div className="bg-[#202020] p-6 rounded-2xl border border-[#5b403d]/40 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e4beba]">
                    Ventas Totales
                  </span>
                  <div className="p-2 bg-[#f8bd2a]/15 rounded-xl border border-[#f8bd2a]/30">
                    <span className="material-symbols-outlined text-[#f8bd2a] text-xl">
                      payments
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {formatCOP(totalSales)}
                  </div>
                  <div className="text-[#7ddc7a] text-xs font-extrabold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12% vs ayer</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Orders Today */}
              <div className="bg-[#202020] p-6 rounded-2xl border border-[#5b403d]/40 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e4beba]">
                    Órdenes Hoy
                  </span>
                  <div className="p-2 bg-[#f8bd2a]/15 rounded-xl border border-[#f8bd2a]/30">
                    <span className="material-symbols-outlined text-[#f8bd2a] text-xl">
                      receipt
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {ordersCount}
                  </div>
                  <div className="text-[#7ddc7a] text-xs font-extrabold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+5% vs ayer</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 3: Average Ticket */}
              <div className="bg-[#202020] p-6 rounded-2xl border border-[#5b403d]/40 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e4beba]">
                    Ticket Promedio
                  </span>
                  <div className="p-2 bg-[#f8bd2a]/15 rounded-xl border border-[#f8bd2a]/30">
                    <span className="material-symbols-outlined text-[#f8bd2a] text-xl">
                      local_atm
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {formatCOP(averageTicket)}
                  </div>
                  <div className="text-[#e4beba]/70 text-xs font-bold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_flat</span>
                    <span>Margen estimado: 68%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid: Hourly Sales Chart + Top Selling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales by Hour Chart */}
              <div className="lg:col-span-2 bg-[#202020] rounded-2xl border border-[#5b403d]/40 p-6 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      Ventas por Hora (Flujo de Horno)
                    </h3>
                    <p className="text-xs text-[#e4beba]/60 mt-0.5">
                      Pico de venta registrado a la 1:00 PM (Almuerzo)
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#2a2a2a] text-[#f8bd2a] rounded-lg text-xs font-bold border border-[#5b403d]/30">
                    Hoy (En vivo)
                  </span>
                </div>

                {/* Bar Chart Area */}
                <div className="flex-1 relative min-h-[260px] flex items-end gap-2.5 pt-8 pb-2">
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
                        <div
                          className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-[#131313] border border-[#f8bd2a] text-[#f8bd2a] px-2 py-1 rounded-md text-xs font-extrabold transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          ${d.amount} ({d.count} ord)
                        </div>

                        {/* Bar visual */}
                        <div
                          style={{ height: d.height }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            d.isPeak
                              ? 'bg-[#d32f2f] hover:bg-[#ffb3ac]'
                              : d.isSecondary
                              ? 'bg-[#f8bd2a] hover:bg-[#ffdfa0]'
                              : 'bg-[#353535] group-hover:bg-[#d32f2f]'
                          }`}
                        ></div>

                        <span className="text-xs font-bold text-[#e4beba]/70 group-hover:text-white">
                          {d.hour}
                        </span>
                      </div>
                    );
                  })}

                  {/* Y-axis background guidelines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[28px] opacity-10">
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                  </div>
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="bg-[#202020] rounded-2xl border border-[#5b403d]/40 p-6 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      Platos Más Vendidos
                    </h3>
                    <p className="text-xs text-[#e4beba]/60 mt-0.5">Top del día</p>
                  </div>
                  <span className="text-[#f8bd2a] text-xs font-bold">Ranking</span>
                </div>

                <div className="flex flex-col gap-3">
                  {topSelling.map((prod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-[#131313] rounded-xl border border-[#5b403d]/30 hover:border-[#d32f2f] transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#2a2a2a]">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-[#7ddc7a] font-semibold">
                          {prod.sold} porciones vendidas
                        </p>
                      </div>
                      <div className="text-base font-extrabold text-[#f8bd2a]">
                        {prod.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAST 10 TRANSACTIONS BREAKDOWN */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Metrics Bar for the Last 10 Transactions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40">
                <span className="text-[11px] font-bold text-[#e4beba] uppercase tracking-wider">
                  Total Procesado (10 Tx)
                </span>
                <div className="text-xl lg:text-2xl font-black text-[#f8bd2a] mt-1">
                  {formatCOP(txStats.totalAmount)}
                </div>
                <div className="text-[11px] text-[#e4beba]/60 mt-0.5">
                  Promedio: {formatCOP(txStats.avgTicket)}/tx
                </div>
              </div>

              <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#e4beba] uppercase tracking-wider">
                    Efectivo
                  </span>
                  <span className="material-symbols-outlined text-[#7ddc7a] text-sm">payments</span>
                </div>
                <div className="text-xl lg:text-2xl font-black text-white mt-1">
                  {formatCOP(txStats.cashTotal)}
                </div>
                <div className="text-[11px] text-[#7ddc7a] font-semibold mt-0.5">
                  {txStats.cashCount} transacciones
                </div>
              </div>

              <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#e4beba] uppercase tracking-wider">
                    Tarjeta / POS
                  </span>
                  <span className="material-symbols-outlined text-[#90caf9] text-sm">credit_card</span>
                </div>
                <div className="text-xl lg:text-2xl font-black text-white mt-1">
                  {formatCOP(txStats.cardTotal)}
                </div>
                <div className="text-[11px] text-[#90caf9] font-semibold mt-0.5">
                  {txStats.cardCount} transacciones
                </div>
              </div>

              <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#e4beba] uppercase tracking-wider">
                    QR Nequi / Transf.
                  </span>
                  <span className="material-symbols-outlined text-[#ce93d8] text-sm">qr_code_2</span>
                </div>
                <div className="text-xl lg:text-2xl font-black text-white mt-1">
                  {formatCOP(txStats.transferTotal)}
                </div>
                <div className="text-[11px] text-[#ce93d8] font-semibold mt-0.5">
                  {txStats.transferCount} transacciones
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
              {/* Search box */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#e4beba]/60">
                  search
                </span>
                <input
                  type="text"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  placeholder="Buscar por # Orden, Mesa, Cliente o Ítem..."
                  className="w-full bg-[#131313] border border-[#5b403d]/50 focus:border-[#f8bd2a] text-xs text-white pl-9 pr-3 py-2 rounded-xl outline-none transition-all placeholder:text-[#e4beba]/40"
                />
                {transactionSearch && (
                  <button
                    onClick={() => setTransactionSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#e4beba]/60 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Payment Method Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                <span className="text-xs font-bold text-[#e4beba]/70 mr-1 hidden md:inline">
                  Método:
                </span>
                {(
                  [
                    { id: 'all' as const, label: 'Todos', icon: 'apps' },
                    { id: 'cash' as const, label: 'Efectivo', icon: 'payments' },
                    { id: 'card' as const, label: 'Tarjeta', icon: 'credit_card' },
                    { id: 'transfer' as const, label: 'QR Nequi', icon: 'qr_code_2' }
                  ]
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPaymentFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      paymentFilter === f.id
                        ? 'bg-[#f8bd2a] text-[#402d00] font-black shadow'
                        : 'bg-[#131313] text-[#e4beba]/80 hover:bg-[#2a2a2a] border border-[#5b403d]/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions Table / List */}
            <div className="bg-[#202020] rounded-2xl border border-[#5b403d]/40 overflow-hidden shadow-xl">
              <div className="p-4 bg-[#1b1c1c] border-b border-[#5b403d]/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f8bd2a]">receipt_long</span>
                  <h3 className="font-extrabold text-sm text-white">
                    Historial de las Últimas {last10Transactions.length} Transacciones
                  </h3>
                </div>
                <span className="text-xs text-[#e4beba]/60">
                  Mostrando {filteredTransactions.length} de {last10Transactions.length}
                </span>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-[#e4beba]/40">
                    find_in_page
                  </span>
                  <p className="text-sm font-bold text-[#e4beba]">
                    No se encontraron transacciones con los filtros seleccionados.
                  </p>
                  <button
                    onClick={() => {
                      setPaymentFilter('all');
                      setTransactionSearch('');
                    }}
                    className="px-4 py-2 bg-[#131313] hover:bg-[#2a2a2a] text-[#f8bd2a] border border-[#5b403d] rounded-xl text-xs font-bold"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#5b403d]/30 text-[11px] font-extrabold uppercase tracking-wider text-[#e4beba]/70 bg-[#171717]">
                        <th className="py-3.5 px-4">Orden / Ticket</th>
                        <th className="py-3.5 px-4">Hora & Fecha</th>
                        <th className="py-3.5 px-4">Servicio & Cliente</th>
                        <th className="py-3.5 px-4">Ítems Principales</th>
                        <th className="py-3.5 px-4">Método de Pago</th>
                        <th className="py-3.5 px-4 text-right">Total Facturado</th>
                        <th className="py-3.5 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5b403d]/20 text-xs">
                      {filteredTransactions.map((tx) => {
                        const dt = formatDateTime(tx.createdAt);
                        const totalUnits = tx.items.reduce((sum, it) => sum + it.quantity, 0);

                        return (
                          <tr
                            key={tx.id}
                            className="hover:bg-[#2a2a2a]/60 transition-colors group cursor-pointer"
                            onClick={() => setSelectedTransaction(tx)}
                          >
                            {/* Order Number */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-white group-hover:text-[#f8bd2a] transition-colors">
                                  #{tx.orderNumber || tx.id}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#20812c]/20 text-[#7ddc7a] border border-[#7ddc7a]/30">
                                  Cobrada
                                </span>
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="py-3.5 px-4 text-white">
                              <div className="font-bold">{dt.time}</div>
                              <div className="text-[11px] text-[#e4beba]/60">{dt.date}</div>
                            </td>

                            {/* Service Type & Customer */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`material-symbols-outlined text-sm ${
                                    tx.type === 'dine-in'
                                      ? 'text-[#f8bd2a]'
                                      : tx.type === 'takeout'
                                      ? 'text-[#90caf9]'
                                      : 'text-[#ce93d8]'
                                  }`}
                                >
                                  {tx.type === 'dine-in'
                                    ? 'table_restaurant'
                                    : tx.type === 'takeout'
                                    ? 'shopping_bag'
                                    : 'moped'}
                                </span>
                                <span className="font-extrabold text-white">
                                  {tx.tableName || (tx.type === 'dine-in' ? 'Mesa' : tx.type === 'takeout' ? 'Para Llevar' : 'Domicilio')}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#e4beba]/70 truncate max-w-[140px]">
                                {tx.customerName || 'Cliente general'}
                              </div>
                            </td>

                            {/* Items preview */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-[#131313] text-[#f8bd2a] font-black text-[10px] border border-[#5b403d]/40">
                                  {totalUnits} und
                                </span>
                                <span className="text-[#e4beba]/90 truncate max-w-[180px]">
                                  {tx.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                                </span>
                              </div>
                            </td>

                            {/* Payment Method Badge */}
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#131313] border border-[#5b403d]/40">
                                {tx.paymentMethod === 'cash' ? (
                                  <>
                                    <span className="material-symbols-outlined text-[#7ddc7a] text-sm">
                                      payments
                                    </span>
                                    <span className="text-[#7ddc7a]">Efectivo</span>
                                  </>
                                ) : tx.paymentMethod === 'card' ? (
                                  <>
                                    <span className="material-symbols-outlined text-[#90caf9] text-sm">
                                      credit_card
                                    </span>
                                    <span className="text-[#90caf9]">Tarjeta POS</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="material-symbols-outlined text-[#ce93d8] text-sm">
                                      qr_code_2
                                    </span>
                                    <span className="text-[#ce93d8]">QR Nequi/Transf</span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Total Amount */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-mono font-black text-base text-[#f8bd2a]">
                                {formatCOP(tx.total)}
                              </div>
                              {tx.tip > 0 && (
                                <div className="text-[10px] text-[#7ddc7a] font-semibold">
                                  +{formatCOP(tx.tip)} propina
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTransaction(tx);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#353535] hover:bg-[#d32f2f] text-white transition-colors cursor-pointer"
                                  title="Ver Desglose Completo"
                                >
                                  <span className="material-symbols-outlined text-base">visibility</span>
                                </button>

                                {onViewReceipt && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewReceipt(tx);
                                    }}
                                    className="p-1.5 rounded-lg bg-[#353535] hover:bg-[#f8bd2a] hover:text-[#402d00] text-white transition-colors cursor-pointer"
                                    title="Ver / Imprimir Comprobante Fiscal"
                                  >
                                    <span className="material-symbols-outlined text-base">receipt</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TRANSACTION DETAIL MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#202020] border-2 border-[#5b403d] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-[#d32f2f] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/25 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg">
                      Transacción #{selectedTransaction.orderNumber || selectedTransaction.id}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#20812c] text-white">
                      Completada
                    </span>
                  </div>
                  <p className="text-xs text-[#fff2f0]/80">
                    {formatDateTime(selectedTransaction.createdAt).date} •{' '}
                    {formatDateTime(selectedTransaction.createdAt).time} • Estación 01
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              {/* Meta information row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#131313] p-3.5 rounded-2xl border border-[#5b403d]/40 text-xs">
                <div>
                  <span className="text-[#e4beba]/60 block text-[10px] uppercase font-bold">
                    Servicio / Canal
                  </span>
                  <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm text-[#f8bd2a]">
                      {selectedTransaction.type === 'dine-in'
                        ? 'table_restaurant'
                        : selectedTransaction.type === 'takeout'
                        ? 'shopping_bag'
                        : 'moped'}
                    </span>
                    <span>
                      {selectedTransaction.tableName ||
                        (selectedTransaction.type === 'dine-in'
                          ? 'Mesa'
                          : selectedTransaction.type === 'takeout'
                          ? 'Para Llevar'
                          : 'Domicilio')}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-[#e4beba]/60 block text-[10px] uppercase font-bold">
                    Cliente
                  </span>
                  <span className="font-extrabold text-white mt-0.5 block truncate">
                    {selectedTransaction.customerName || 'Cliente general'}
                  </span>
                </div>

                <div>
                  <span className="text-[#e4beba]/60 block text-[10px] uppercase font-bold">
                    Método de Pago
                  </span>
                  <span className="font-extrabold text-[#f8bd2a] mt-0.5 block uppercase">
                    {selectedTransaction.paymentMethod === 'cash'
                      ? 'Efectivo'
                      : selectedTransaction.paymentMethod === 'card'
                      ? 'Tarjeta POS'
                      : 'QR Nequi/Transf'}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e4beba] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">restaurant</span>
                  <span>Artículos Ordenados ({selectedTransaction.items.reduce((s, i) => s + i.quantity, 0)})</span>
                </h4>

                <div className="bg-[#131313] rounded-2xl border border-[#5b403d]/40 divide-y divide-[#5b403d]/30 overflow-hidden">
                  {selectedTransaction.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-start gap-3 text-xs">
                      {it.image && (
                        <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] overflow-hidden shrink-0">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-white">
                            <span className="text-[#f8bd2a] mr-1.5">{it.quantity}x</span>
                            {it.name}
                          </h5>
                          <span className="font-mono font-bold text-white">
                            {formatCOP(it.totalUnitPrice * it.quantity)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#e4beba]/60 mt-0.5">
                          {formatCOP(it.totalUnitPrice)} c/u
                        </div>

                        {/* Modifiers if any */}
                        {it.selectedModifiers.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {it.selectedModifiers.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-1.5 py-0.5 rounded bg-[#202020] border border-[#5b403d]/40 text-[10px] text-[#e4beba] font-medium"
                              >
                                + {m.name} {m.price > 0 && `(+${formatCOP(m.price)})`}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Cooking notes */}
                        {it.notes && (
                          <div className="mt-1 text-[11px] text-[#ffdfa0] italic flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">edit_note</span>
                            <span>Nota: {it.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="bg-[#131313] p-4 rounded-2xl border border-[#5b403d]/40 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#e4beba]">
                  <span>SUBTOTAL:</span>
                  <span className="text-white">{formatCOP(selectedTransaction.subtotal)}</span>
                </div>

                {selectedTransaction.discount > 0 && (
                  <div className="flex justify-between text-[#ffb3ac]">
                    <span>DESCUENTO APLICADO:</span>
                    <span>-{formatCOP(selectedTransaction.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#e4beba]">
                  <span>IVA (19%):</span>
                  <span className="text-white">{formatCOP(selectedTransaction.tax)}</span>
                </div>

                {selectedTransaction.tip > 0 && (
                  <div className="flex justify-between text-[#7ddc7a]">
                    <span>PROPINA VOLUNTARIA:</span>
                    <span>+{formatCOP(selectedTransaction.tip)}</span>
                  </div>
                )}

                <div className="border-t border-[#5b403d]/50 pt-2 flex justify-between text-base font-black text-white">
                  <span>TOTAL COBRADO:</span>
                  <span className="text-[#f8bd2a]">{formatCOP(selectedTransaction.total)}</span>
                </div>

                {selectedTransaction.paymentMethod === 'cash' && selectedTransaction.paidAmount && (
                  <div className="pt-2 border-t border-[#5b403d]/30 text-[11px] space-y-1 text-[#e4beba]/80">
                    <div className="flex justify-between">
                      <span>Monto Entregado:</span>
                      <span>{formatCOP(selectedTransaction.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[#7ddc7a] font-bold">
                      <span>Cambio / Vueltas:</span>
                      <span>{formatCOP(selectedTransaction.change || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-[#1b1c1c] border-t border-[#5b403d]/40 flex gap-3">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-1/3 py-3 rounded-xl border border-[#5b403d] text-[#e4beba] font-bold text-xs hover:bg-[#2a2a2a] transition-all cursor-pointer"
              >
                Cerrar
              </button>

              {onViewReceipt && (
                <button
                  onClick={() => {
                    const tx = selectedTransaction;
                    setSelectedTransaction(null);
                    onViewReceipt(tx);
                  }}
                  className="flex-1 py-3 bg-[#f8bd2a] hover:bg-[#ffdfa0] text-[#402d00] font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">receipt</span>
                  <span>Ver Comprobante Fiscal / Imprimir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
