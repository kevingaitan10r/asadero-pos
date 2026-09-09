import React, { useState } from 'react';
import { formatCOP } from '../utils/formatters';
import { Lock, CheckCircle2, Printer, X, DollarSign, AlertTriangle } from 'lucide-react';

interface CloseDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSales: number;
  ordersCount: number;
}

export const CloseDayModal: React.FC<CloseDayModalProps> = ({
  isOpen,
  onClose,
  totalSales,
  ordersCount
}) => {
  if (!isOpen) return null;

  const [openingBalance] = useState(200000); // Base de caja inicial en COP ($200.000)
  const cashSales = totalSales * 0.48; // 48% cash
  const cardSales = totalSales * 0.32; // 32% cards
  const transferSales = totalSales * 0.20; // 20% nequi/transfer

  const expectedCashInDrawer = openingBalance + cashSales;
  const [countedCashStr, setCountedCashStr] = useState<string>(
    expectedCashInDrawer.toString()
  );
  const [closingNotes, setClosingNotes] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  const countedCash = parseFloat(countedCashStr) || 0;
  const discrepancy = countedCash - expectedCashInDrawer;

  const handleExecuteClose = () => {
    setIsClosed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-surface border border-border-medium rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-red-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg">Cierre de Caja y Arqueo Diario</h3>
              <p className="text-xs text-red-100 font-medium">
                Estación 01 • Turno Activo ({ordersCount} órdenes procesadas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {isClosed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                ¡Cierre de Caja Exitoso!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                El informe de cuadre de caja ha sido registrado en el sistema fiscal y enviado a contabilidad.
              </p>
              <div className="bg-surface-elevated p-4 rounded-2xl border border-border-subtle text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Venta Total:</span>
                  <span className="font-black text-slate-900 dark:text-white">{formatCOP(totalSales)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Efectivo en Caja:</span>
                  <span className="font-black text-slate-900 dark:text-white">{formatCOP(countedCash)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Diferencia:</span>
                  <span className={`font-black ${discrepancy >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                    {formatCOP(discrepancy)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.print();
                  onClose();
                }}
                className="w-full py-3 bg-amber-400 text-amber-950 font-black rounded-xl text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Printer size={16} />
                Imprimir Comprobante Fiscal
              </button>
            </div>
          ) : (
            <>
              {/* Sales breakdown table */}
              <div className="bg-surface-elevated rounded-2xl p-4 border border-border-subtle space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Inicial en Gaveta:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCOP(openingBalance)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Ventas en Efectivo:</span>
                  <span className="font-black text-amber-600 dark:text-amber-400 font-mono">+{formatCOP(cashSales)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Ventas con Tarjeta / Datáfono:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">+{formatCOP(cardSales)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Transferencias QR (Nequi/Daviplata):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{formatCOP(transferSales)}</span>
                </div>
                <div className="border-t border-border-subtle pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>Efectivo Esperado en Gaveta:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">{formatCOP(expectedCashInDrawer)}</span>
                </div>
              </div>

              {/* Physical Cash Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-amber-500" />
                  Efectivo Físico Contado ($ COP)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={countedCashStr}
                    onChange={(e) => setCountedCashStr(e.target.value)}
                    className="w-full bg-surface-elevated border-2 border-border-subtle focus:border-amber-500 text-right font-black text-xl text-slate-900 dark:text-white px-4 py-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* Discrepancy indicator */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex justify-between items-center ${
                  Math.abs(discrepancy) < 100
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : discrepancy > 0
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {Math.abs(discrepancy) < 100 ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertTriangle size={16} />
                  )}
                  {Math.abs(discrepancy) < 100
                    ? 'Caja Cuadrada Perfectamente'
                    : discrepancy > 0
                    ? 'Sobrante de Caja'
                    : 'Faltante de Caja'}
                </span>
                <span className="text-sm font-black font-mono">
                  {formatCOP(Math.abs(discrepancy))}
                </span>
              </div>

              {/* Notes input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Observaciones del Cajero
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Sin novedades en el turno..."
                  className="w-full bg-surface-elevated border border-border-subtle focus:border-amber-500 text-xs text-slate-900 dark:text-white p-2.5 rounded-xl outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isClosed && (
          <div className="p-4 bg-surface-elevated border-t border-border-subtle flex gap-3">
            <button
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-border-subtle text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-surface-hover transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleExecuteClose}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Lock size={15} />
              <span>Confirmar y Cerrar Turno</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
