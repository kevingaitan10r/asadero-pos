import React, { useState } from 'react';
import { CartItem, Order, OrderType } from '../types';
import { formatCOP } from '../utils/formatters';

interface CheckoutViewProps {
  orderNumber: number;
  orderType: OrderType;
  tableName: string;
  customerName: string;
  items: CartItem[];
  discountPercent: number;
  onFinishOrder: (orderData: Partial<Order>) => void;
  onBackToMenu: () => void;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliveryNotes?: string;
  onOpenDeliveryModal?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  orderNumber,
  orderType,
  tableName,
  customerName,
  items,
  discountPercent,
  onFinishOrder,
  onBackToMenu,
  deliveryAddress,
  deliveryPhone,
  deliveryNotes,
  onOpenDeliveryModal
}) => {
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(0);
  const [customTip, setCustomTip] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [tenderAmountStr, setTenderAmountStr] = useState<string>('');
  const [showSplitModal, setShowSplitModal] = useState<boolean>(false);
  const [splitWays, setSplitWays] = useState<number>(2);

  // Subtotal & Base calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.totalUnitPrice * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.19; // 19% IVA Colombia

  const tipAmount =
    selectedTipPercent === -1
      ? customTip
      : (taxableAmount * selectedTipPercent) / 100;

  const total = taxableAmount + tax + tipAmount;

  // Tendered amount handling
  const tenderedNumeric = parseFloat(tenderAmountStr) || 0;
  const change = Math.max(0, tenderedNumeric - total);
  const remaining = Math.max(0, total - tenderedNumeric);

  // Numpad handlers
  const handleNumpadPress = (digit: string) => {
    if (digit === '.') {
      if (!tenderAmountStr.includes('.')) {
        setTenderAmountStr((prev) => (prev === '' ? '0.' : prev + '.'));
      }
    } else {
      setTenderAmountStr((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setTenderAmountStr((prev) => prev.slice(0, -1));
  };

  const handleExactAmount = () => {
    setTenderAmountStr(total.toString());
  };

  const handlePresetAmount = (amt: number) => {
    setTenderAmountStr(amt.toString());
  };

  const handleSelectTip = (percent: number) => {
    setSelectedTipPercent(percent);
    if (percent === -1) {
      const val = prompt('Ingrese el monto de propina voluntaria ($ COP):', '5000');
      if (val && !isNaN(parseFloat(val))) {
        setCustomTip(parseFloat(val));
      }
    }
  };

  const handleCompleteOrder = () => {
    if (items.length === 0) {
      alert('No hay productos en la orden.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress?.trim()) {
      if (onOpenDeliveryModal) {
        onOpenDeliveryModal();
      } else {
        alert('Por favor ingrese la dirección de entrega del domicilio.');
      }
      return;
    }

    const paidAmt = paymentMethod === 'cash' && tenderedNumeric > 0 ? tenderedNumeric : total;

    onFinishOrder({
      orderNumber,
      tableName: orderType === 'delivery' ? 'Domicilio' : 'Para Llevar',
      customerName: customerName || 'Cliente',
      type: orderType,
      items,
      subtotal,
      tax,
      discount: discountAmount,
      tip: tipAmount,
      total,
      paymentMethod,
      paidAmount: paidAmt,
      change: paymentMethod === 'cash' ? change : 0,
      status: 'completed',
      createdAt: new Date().toISOString(),
      deliveryAddress,
      deliveryPhone,
      deliveryNotes
    });
  };

  return (
    <div
      id="checkout-workspace"
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6 gap-6 bg-background select-none custom-scrollbar"
    >
      {/* Top Header Controls in Checkout */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-elevated hover:bg-surface-hover text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-border-subtle transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Volver al Menú</span>
          </button>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Finalizar Cobro y Facturación
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="px-3 py-1.5 bg-surface-elevated rounded-xl border border-border-subtle shadow-xs">
            {orderType === 'delivery' ? '🛵 Domicilio' : '🛍️ Para Llevar'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Bill Summary, Right = Payment and Numpad */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
        {/* LEFT COLUMN: Order Summary (The Bill) */}
        <div className="w-full lg:w-[360px] xl:w-[400px] bg-surface rounded-2xl border border-border-subtle flex flex-col overflow-hidden shrink-0 shadow-md">
          {/* Header */}
          <div className="p-4 border-b border-border-subtle bg-surface-elevated flex justify-between items-center">
            <div>
              <p className="text-[11px] text-red-600 dark:text-red-400 font-black uppercase tracking-wider">Resumen de Comanda</p>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Orden #{orderNumber}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                {orderType === 'delivery' ? '🛵 Domicilio' : '🛍️ Para Llevar'}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-extrabold">{customerName || 'Comensal'}</p>
            </div>
          </div>

          {/* Delivery Box Alert if Delivery Mode */}
          {orderType === 'delivery' && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs space-y-1">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="font-black text-slate-900 dark:text-white text-xs">
                    📍 {deliveryAddress || '⚠️ Falta ingresar dirección'}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    📞 {deliveryPhone || 'Sin teléfono'} • 👤 {customerName || 'Cliente'}
                  </p>
                  {deliveryNotes && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 italic">
                      *{deliveryNotes}
                    </p>
                  )}
                </div>
                {onOpenDeliveryModal && (
                  <button
                    onClick={onOpenDeliveryModal}
                    className="text-[11px] font-bold text-red-600 dark:text-red-400 underline cursor-pointer shrink-0 ml-2"
                  >
                    {deliveryAddress ? 'Editar' : 'Agregar'}
                  </button>
                )}
              </div>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 pt-1 border-t border-amber-500/15">
                🛵 Se generarán 2 tiquetes (Domiciliario + Control de Caja)
              </p>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar divide-y divide-border-subtle">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.quantity}x {item.name}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.selectedModifiers.map((m) => m.name).join(', ')}
                    </p>
                  )}
                </div>
                <span className="font-black text-amber-600 dark:text-amber-400 font-mono">
                  {formatCOP(item.totalUnitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="p-4 bg-surface-elevated border-t border-border-subtle space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">{formatCOP(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span>Descuento ({discountPercent}%)</span>
                <span className="font-bold">-{formatCOP(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>IVA (19%)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">{formatCOP(tax)}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 items-center">
              <span>Propina Servicio</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                +{formatCOP(tipAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border-subtle pt-3">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Total a Cobrar</span>
              <span
                id="total-amount-display"
                className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono"
              >
                {formatCOP(total)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tip, Numpad & Payment Methods */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {/* Tip Selection */}
          <div className="bg-surface p-4 rounded-2xl border border-border-subtle shrink-0 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Propina Voluntaria de Servicio
            </h3>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleSelectTip(0)}
                className={`flex-1 h-11 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 0
                    ? 'border-red-600 bg-red-500/10 text-red-600 dark:text-red-400 font-black'
                    : 'border-border-subtle bg-surface-elevated text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                Ninguna (0%)
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(10)}
                className={`flex-1 h-11 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 10
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black'
                    : 'border-border-subtle bg-surface-elevated text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                10% ({formatCOP((taxableAmount * 10) / 100)})
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(15)}
                className={`flex-1 h-11 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 15
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black'
                    : 'border-border-subtle bg-surface-elevated text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                15% ({formatCOP((taxableAmount * 15) / 100)})
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(-1)}
                className={`flex-1 h-11 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === -1
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black'
                    : 'border-border-subtle bg-surface-elevated text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                {selectedTipPercent === -1 ? formatCOP(customTip) : 'Personalizada'}
              </button>
            </div>
          </div>

          {/* Main Interaction Area: Numpad + Payment Methods */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-[350px]">
            {/* Numpad Container */}
            <div className="w-full md:w-1/2 bg-surface p-5 rounded-2xl border border-border-subtle flex flex-col shadow-sm">
              {/* Tender Display */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Monto Recibido (Efectivo COP)</span>
                  <button
                    onClick={handleExactAmount}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Monto Exacto
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={tenderAmountStr}
                    onChange={(e) => setTenderAmountStr(e.target.value)}
                    placeholder={total.toString()}
                    className="w-full bg-surface-elevated border-2 border-border-subtle focus:border-amber-500 text-right font-black text-2xl text-slate-900 dark:text-white px-4 py-2.5 rounded-xl outline-none font-mono"
                  />
                </div>

                {/* Quick Bills COP ($50k, $100k, $200k) */}
                <div className="flex gap-2 mt-2">
                  {[50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handlePresetAmount(amt)}
                      className="flex-1 py-1.5 bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer shadow-xs transition-all"
                    >
                      {formatCOP(amt)}
                    </button>
                  ))}
                </div>

                {/* Change or Remaining status indicator */}
                {paymentMethod === 'cash' && tenderAmountStr && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-surface-elevated border border-border-subtle flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {tenderedNumeric >= total ? 'Cambio a Devolver:' : 'Faltante:'}
                    </span>
                    <span
                      className={`font-black text-sm font-mono ${
                        tenderedNumeric >= total ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tenderedNumeric >= total ? formatCOP(change) : formatCOP(remaining)}
                    </span>
                  </div>
                )}
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-3 gap-2 flex-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleNumpadPress(digit)}
                    className="bg-surface-elevated hover:bg-surface-hover active:scale-95 text-slate-900 dark:text-white font-black text-xl rounded-xl transition-all border border-border-subtle flex items-center justify-center cursor-pointer min-h-[44px]"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="bg-surface-elevated hover:bg-red-500/10 active:scale-95 text-red-600 dark:text-red-400 rounded-xl transition-all border border-border-subtle flex items-center justify-center cursor-pointer min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-2xl">backspace</span>
                </button>
                <button
                  onClick={() => handleNumpadPress('0')}
                  className="bg-surface-elevated hover:bg-surface-hover active:scale-95 text-slate-900 dark:text-white font-black text-xl rounded-xl transition-all border border-border-subtle flex items-center justify-center cursor-pointer min-h-[44px]"
                >
                  0
                </button>
                <button
                  onClick={() => handleNumpadPress('000')}
                  className="bg-surface-elevated hover:bg-surface-hover active:scale-95 text-slate-900 dark:text-white font-black text-sm rounded-xl transition-all border border-border-subtle flex items-center justify-center cursor-pointer min-h-[44px]"
                >
                  000
                </button>
              </div>
            </div>

            {/* Payment Methods & Actions Container */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 flex-1">
                {/* Cash */}
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-red-500/10 border-red-600 text-slate-900 dark:text-white shadow-md'
                      : 'bg-surface border-border-subtle text-slate-600 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-amber-500">
                    payments
                  </span>
                  <span className="font-bold text-sm">Efectivo</span>
                </button>

                {/* Card */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-red-500/10 border-red-600 text-slate-900 dark:text-white shadow-md'
                      : 'bg-surface border-border-subtle text-slate-600 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-emerald-500">
                    credit_card
                  </span>
                  <span className="font-bold text-sm">Tarjeta / Datáfono</span>
                </button>

                {/* Transfer / Nequi / Daviplata */}
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer col-span-2 ${
                    paymentMethod === 'transfer'
                      ? 'bg-red-500/10 border-red-600 text-slate-900 dark:text-white shadow-md'
                      : 'bg-surface border-border-subtle text-slate-600 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-red-500">
                    qr_code_2
                  </span>
                  <span className="font-bold text-sm">Transferencia (Nequi / Daviplata / QR)</span>
                </button>
              </div>

              {/* Split Bill Button */}
              <button
                onClick={() => setShowSplitModal(true)}
                className="w-full py-3 bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-lg text-amber-500">call_split</span>
                <span>Dividir Cuenta por Comensales</span>
              </button>

              {/* Finish Order Primary Action Button */}
              <button
                id="btn-complete-checkout"
                onClick={handleCompleteOrder}
                className="w-full h-14 sm:h-16 bg-red-600 hover:bg-red-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <span>Completar Pago ({formatCOP(total)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Bill Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-medium rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Dividir Cuenta de Comensales</h3>
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => setSplitWays(Math.max(2, splitWays - 1))}
                className="w-10 h-10 rounded-xl bg-surface-elevated text-slate-800 dark:text-white font-bold text-xl border border-border-subtle cursor-pointer hover:bg-surface-hover"
              >
                -
              </button>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{splitWays} personas</span>
              <button
                onClick={() => setSplitWays(splitWays + 1)}
                className="w-10 h-10 rounded-xl bg-surface-elevated text-slate-800 dark:text-white font-bold text-xl border border-border-subtle cursor-pointer hover:bg-surface-hover"
              >
                +
              </button>
            </div>
            <div className="p-4 bg-surface-elevated rounded-xl text-center border border-border-subtle">
              <p className="text-xs text-slate-500 dark:text-slate-400">Cada persona paga:</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {formatCOP(total / splitWays)}
              </p>
            </div>
            <button
              onClick={() => setShowSplitModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
