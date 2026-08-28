import React, { useState } from 'react';
import { formatCOP } from '../utils/formatters';

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#202020] border-2 border-[#5b403d] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#d32f2f] text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl">lock</span>
            <div>
              <h3 className="font-black text-lg">Cierre de Caja (Arqueo Final COP)</h3>
              <p className="text-xs text-[#fff2f0]/80">
                Estación 01 • Turno Matutino/Vespertino
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {isClosed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#20812c] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h4 className="text-xl font-extrabold text-white">
                ¡Cierre de Caja Exitoso!
              </h4>
              <p className="text-xs text-[#e4beba]/80 max-w-sm mx-auto">
                El informe de cuadre de caja ha sido registrado en el sistema fiscal y enviado a contabilidad.
              </p>
              <div className="bg-[#131313] p-4 rounded-2xl border border-[#5b403d]/40 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-[#e4beba]">
                  <span>Venta Total:</span>
                  <span className="font-bold text-white">{formatCOP(totalSales)}</span>
                </div>
                <div className="flex justify-between text-[#e4beba]">
                  <span>Efectivo en Caja:</span>
                  <span className="font-bold text-white">{formatCOP(countedCash)}</span>
                </div>
                <div className="flex justify-between text-[#e4beba]">
                  <span>Diferencia:</span>
                  <span className={`font-bold ${discrepancy >= 0 ? 'text-[#7ddc7a]' : 'text-[#ffb3ac]'}`}>
                    {formatCOP(discrepancy)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.print();
                  onClose();
                }}
                className="w-full py-3 bg-[#f8bd2a] text-[#402d00] font-black rounded-xl text-sm hover:bg-[#ffdfa0] transition-all"
              >
                Imprimir Comprobante Fiscal
              </button>
            </div>
          ) : (
            <>
              {/* Sales breakdown table */}
              <div className="bg-[#131313] rounded-2xl p-4 border border-[#5b403d]/40 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#e4beba]">
                  <span>Base Inicial en Gaveta:</span>
                  <span className="font-bold text-white">{formatCOP(openingBalance)}</span>
                </div>
                <div className="flex justify-between text-[#e4beba]">
                  <span>Ventas en Efectivo:</span>
                  <span className="font-bold text-[#f8bd2a]">+{formatCOP(cashSales)}</span>
                </div>
                <div className="flex justify-between text-[#e4beba]">
                  <span>Ventas con Tarjeta / Datáfono:</span>
                  <span className="font-bold text-white">+{formatCOP(cardSales)}</span>
                </div>
                <div className="flex justify-between text-[#e4beba]">
                  <span>Transferencias QR (Nequi/Daviplata):</span>
                  <span className="font-bold text-[#7ddc7a]">+{formatCOP(transferSales)}</span>
                </div>
                <div className="border-t border-[#5b403d]/40 pt-2 flex justify-between text-sm font-black text-white">
                  <span>Efectivo Esperado en Gaveta:</span>
                  <span className="text-[#f8bd2a]">{formatCOP(expectedCashInDrawer)}</span>
                </div>
              </div>

              {/* Physical Cash Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  Efectivo Físico Contado ($ COP)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={countedCashStr}
                    onChange={(e) => setCountedCashStr(e.target.value)}
                    className="w-full bg-[#131313] border-2 border-[#5b403d]/60 focus:border-[#f8bd2a] text-right font-black text-xl text-white px-4 py-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Discrepancy indicator */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex justify-between items-center ${
                  Math.abs(discrepancy) < 100
                    ? 'bg-[#20812c]/20 border-[#7ddc7a] text-[#7ddc7a]'
                    : discrepancy > 0
                    ? 'bg-[#f8bd2a]/20 border-[#f8bd2a] text-[#f8bd2a]'
                    : 'bg-[#93000a]/20 border-[#ffb3ac] text-[#ffb3ac]'
                }`}
              >
                <span>
                  {Math.abs(discrepancy) < 100
                    ? '✓ Caja Cuadrada Perfectamente'
                    : discrepancy > 0
                    ? '▲ Sobrante de Caja'
                    : '▼ Faltante de Caja'}
                </span>
                <span className="text-sm font-black">
                  {formatCOP(Math.abs(discrepancy))}
                </span>
              </div>

              {/* Notes input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#e4beba]">
                  Observaciones del Cajero
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Sin novedades en el turno..."
                  className="w-full bg-[#131313] border border-[#5b403d]/40 text-xs text-white p-2.5 rounded-xl outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isClosed && (
          <div className="p-4 bg-[#1b1c1c] border-t border-[#5b403d]/40 flex gap-3">
            <button
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-[#5b403d] text-[#e4beba] font-bold text-xs hover:bg-[#2a2a2a] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleExecuteClose}
              className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Confirmar y Cerrar Turno</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
