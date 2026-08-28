import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { formatCOP } from '../utils/formatters';

interface FinancesViewProps {
  totalSales: number;
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  totalSales,
  expenses,
  onAddExpense
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);

  // New Expense Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('insumos');
  const [amount, setAmount] = useState<number>(50);
  const [supplier, setSupplier] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const profitMarginPercent = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  // Breakdown by category
  const getExpensesByCategory = (cat: ExpenseCategory) => {
    return expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const categories: { id: ExpenseCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Todos los Gastos', icon: 'receipt' },
    { id: 'insumos', label: 'Insumos & Ingredientes', icon: 'local_grocery_store' },
    { id: 'servicios', label: 'Servicios Públicos (Luz/Gas)', icon: 'bolt' },
    { id: 'nomina', label: 'Nómina & Sueldos', icon: 'badge' },
    { id: 'mantenimiento', label: 'Mantenimiento & Equipos', icon: 'handyman' },
    { id: 'otros', label: 'Otros Gastos Operativos', icon: 'more_horiz' }
  ];

  // Filtered Expenses List
  const filteredExpenses = expenses.filter((exp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        exp.title.toLowerCase().includes(q) ||
        (exp.supplier && exp.supplier.toLowerCase().includes(q)) ||
        (exp.notes && exp.notes.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    onAddExpense({
      title,
      category,
      amount,
      date,
      supplier,
      notes
    });

    setIsAddExpenseOpen(false);
    setTitle('');
    setAmount(50);
    setSupplier('');
    setNotes('');
  };

  return (
    <div
      id="finances-workspace"
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 gap-6 bg-[#131313] select-none custom-scrollbar"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestión Financiera & Rentabilidad
          </h2>
          <p className="text-xs text-[#e4beba]/70 mt-0.5">
            Balance en tiempo real de ingresos por ventas vs gastos operativos y margen neto de ganancia.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs rounded-xl shadow-lg border border-[#ffb3ac]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_card</span>
          <span>Registrar Nuevo Gasto</span>
        </button>
      </div>

      {/* Financial Overview Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-[#202020] p-5 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Ventas Totales (Ingresos)</p>
            <h3 className="text-2xl font-black text-[#7ddc7a] mt-1">{formatCOP(totalSales)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#20812c]/20 border border-[#7ddc7a]/40 flex items-center justify-center text-[#7ddc7a]">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#202020] p-5 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Gastos Totales (Egresos)</p>
            <h3 className="text-2xl font-black text-[#ffb3ac] mt-1">{formatCOP(totalExpenses)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d32f2f]/20 border border-[#d32f2f]/40 flex items-center justify-center text-[#ffb3ac]">
            <span className="material-symbols-outlined text-2xl">trending_down</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-[#202020] p-5 rounded-2xl border border-[#f8bd2a]/40 flex items-center justify-between shadow-md bg-gradient-to-br from-[#202020] to-[#2a2a1a]">
          <div>
            <p className="text-xs text-[#f8bd2a] font-semibold uppercase tracking-wider">Ganancia Neta (Utilidad)</p>
            <h3 className="text-2xl font-black text-[#f8bd2a] mt-1">{formatCOP(netProfit)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#f8bd2a]/20 border border-[#f8bd2a]/50 flex items-center justify-center text-[#f8bd2a]">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-[#202020] p-5 rounded-2xl border border-[#5b403d]/40 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs text-[#e4beba]/70 font-semibold uppercase tracking-wider">Margen de Ganancia</p>
            <h3 className="text-2xl font-black text-white mt-1">{profitMarginPercent.toFixed(1)}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#5b403d]/40 flex items-center justify-center text-[#ffb3ac]">
            <span className="material-symbols-outlined text-2xl">percent</span>
          </div>
        </div>
      </div>

      {/* Expenses Breakdown Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Category Breakdown Card */}
        <div className="bg-[#1b1c1c] p-5 rounded-2xl border border-[#5b403d]/40 flex flex-col gap-4 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f8bd2a]">pie_chart</span>
            Desglose de Gastos por Categoría
          </h3>

          <div className="space-y-3.5">
            {[
              { id: 'insumos', label: 'Insumos & Ingredientes', color: 'bg-[#d32f2f]' },
              { id: 'servicios', label: 'Servicios Públicos', color: 'bg-[#f8bd2a]' },
              { id: 'nomina', label: 'Nómina & Personal', color: 'bg-[#7ddc7a]' },
              { id: 'mantenimiento', label: 'Mantenimiento Equipos', color: 'bg-[#3b82f6]' },
              { id: 'otros', label: 'Otros Gastos', color: 'bg-[#a855f7]' }
            ].map((cat) => {
              const amt = getExpensesByCategory(cat.id as ExpenseCategory);
              const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#e5e2e1]">{cat.label}</span>
                    <span className="text-[#e4beba]/80">
                      {formatCOP(amt)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses List & Filter */}
        <div className="lg:col-span-2 bg-[#1b1c1c] p-5 rounded-2xl border border-[#5b403d]/40 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb3ac]">receipt_long</span>
              Registro de Egresos & Gastos Recientes
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#e4beba]/60">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar gasto o proveedor..."
                  className="bg-[#2a2a2a] border border-[#5b403d]/40 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#d32f2f] text-white border border-[#ffb3ac]/50'
                    : 'bg-[#2a2a2a] text-[#e4beba]/70 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#202020] text-[#e4beba]/80 border-b border-[#5b403d]/40 uppercase text-[10px] font-bold">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto / Descripción</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5b403d]/30 text-[#e5e2e1]">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#e4beba]/50">
                      No hay gastos registrados en esta categoría.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[#252525] transition-colors">
                      <td className="p-3 text-[#e4beba]/70 font-mono">{exp.date}</td>
                      <td className="p-3">
                        <p className="font-bold text-white text-xs">{exp.title}</p>
                        {exp.notes && (
                          <p className="text-[11px] text-[#e4beba]/60 mt-0.5">{exp.notes}</p>
                        )}
                      </td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 bg-[#2a2a2a] rounded text-[10px] font-semibold text-[#ffb3ac]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#e4beba]/70">{exp.supplier || '-'}</td>
                      <td className="p-3 text-right font-black text-[#ffb3ac] text-sm">
                        -{formatCOP(exp.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Registrar Nuevo Gasto */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#5b403d]/40">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb3ac]">add_card</span>
                Registrar Nuevo Gasto Operativo
              </h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-[#e4beba]/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Concepto / Título del Gasto:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Factura de Gas Industrial o Compra Carbón 100kg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none focus:border-[#f8bd2a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Monto ($):</label>
                  <input
                    type="number"
                    step="0.50"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#f8bd2a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Categoría:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none capitalize"
                  >
                    <option value="insumos">Insumos & Ingredientes</option>
                    <option value="servicios">Servicios Públicos</option>
                    <option value="nomina">Nómina & Sueldos</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Proveedor / Beneficiario:</label>
                  <input
                    type="text"
                    placeholder="Ej. Distribuidora Central"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#e4beba] mb-1">Fecha:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">Notas / Factura:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles adicionales, número de factura o comprobante..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 text-white p-2.5 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="flex-1 py-3 bg-[#2a2a2a] text-[#e4beba] rounded-xl font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-xl font-bold text-xs shadow-lg"
                >
                  Registrar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
