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
  const [amount, setAmount] = useState<number>(50000);
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
    setAmount(50000);
    setSupplier('');
    setNotes('');
  };

  return (
    <div
      id="finances-workspace"
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 gap-6 bg-background select-none custom-scrollbar"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Gestión Financiera & Rentabilidad
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Balance en tiempo real de ingresos por ventas vs gastos operativos y margen neto de ganancia.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_card</span>
          <span>Registrar Nuevo Gasto</span>
        </button>
      </div>

      {/* Financial Overview Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-surface p-5 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Ventas Totales (Ingresos)</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatCOP(totalSales)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-surface p-5 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Gastos Totales (Egresos)</p>
            <h3 className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 mt-1 font-mono">{formatCOP(totalExpenses)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined text-2xl">trending_down</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-surface p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-sm bg-gradient-to-br from-amber-500/5 to-transparent">
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">Ganancia Neta (Utilidad)</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{formatCOP(netProfit)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-surface p-5 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Margen de Ganancia</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{profitMarginPercent.toFixed(1)}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-2xl">percent</span>
          </div>
        </div>
      </div>

      {/* Expenses Breakdown Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Category Breakdown Card */}
        <div className="bg-surface p-5 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">pie_chart</span>
            Desglose de Gastos por Categoría
          </h3>

          <div className="space-y-3.5">
            {[
              { id: 'insumos', label: 'Insumos & Ingredientes', color: 'bg-red-500' },
              { id: 'servicios', label: 'Servicios Públicos', color: 'bg-amber-500' },
              { id: 'nomina', label: 'Nómina & Personal', color: 'bg-emerald-500' },
              { id: 'mantenimiento', label: 'Mantenimiento Equipos', color: 'bg-blue-500' },
              { id: 'otros', label: 'Otros Gastos', color: 'bg-purple-500' }
            ].map((cat) => {
              const amt = getExpensesByCategory(cat.id as ExpenseCategory);
              const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{cat.label}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      {formatCOP(amt)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses List & Filter */}
        <div className="lg:col-span-2 bg-surface p-5 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">receipt_long</span>
              Registro de Egresos & Gastos Recientes
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar gasto o proveedor..."
                  className="bg-surface-elevated border border-border-subtle focus:border-amber-500 text-slate-900 dark:text-white text-xs pl-8 pr-3 py-1.5 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-amber-950 font-black shadow-sm'
                    : 'bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-surface-hover border border-border-subtle'
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
                <tr className="bg-surface-elevated/60 text-slate-500 dark:text-slate-400 border-b border-border-subtle uppercase text-[10px] font-black tracking-wider">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto / Descripción</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-slate-700 dark:text-slate-200">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No hay gastos registrados en esta categoría.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{exp.date}</td>
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">{exp.title}</p>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{exp.notes}</p>
                        )}
                      </td>
                      <td className="p-3 capitalize">
                        <span className="px-2 py-0.5 bg-surface-elevated border border-border-subtle rounded text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-500 dark:text-slate-400">{exp.supplier || '-'}</td>
                      <td className="p-3 text-right font-black text-red-600 dark:text-red-400 text-sm font-mono">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">add_card</span>
                Registrar Nuevo Gasto Operativo
              </h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Concepto / Título del Gasto:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Factura de Gas Industrial o Compra Carbón 100kg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Monto ($ COP):</label>
                  <input
                    type="number"
                    step="1000"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs font-bold outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Categoría:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none capitalize"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Proveedor / Beneficiario:</label>
                  <input
                    type="text"
                    placeholder="Ej. Distribuidora Central"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Fecha:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Notas / Factura:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles adicionales, número de factura o comprobante..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white p-2.5 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="flex-1 py-3 bg-surface-elevated border border-border-subtle text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer hover:bg-surface-hover"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer active:scale-95"
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
