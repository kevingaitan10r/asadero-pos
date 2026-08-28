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
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  orderNumber,
  orderType,
  tableName,
  customerName,
  items,
  discountPercent,
  onFinishOrder,
  onBackToMenu
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

    const paidAmt = paymentMethod === 'cash' && tenderedNumeric > 0 ? tenderedNumeric : total;

    onFinishOrder({
      orderNumber,
      tableName: tableName || 'Mesa 12',
      customerName: customerName || 'Comensal',
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
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div
      id="checkout-workspace"
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6 gap-6 bg-[#131313] select-none custom-scrollbar"
    >
      {/* Top Header Controls in Checkout */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1 px-3 py-2 bg-[#202020] hover:bg-[#2a2a2a] text-[#ffb3ac] rounded-xl text-xs font-bold border border-[#5b403d]/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Volver al Menú</span>
          </button>
          <h2 className="text-xl font-extrabold text-white">
            Finalizar Cobro y Facturación
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#e4beba]">
          <span className="px-3 py-1 bg-[#202020] rounded-lg border border-[#5b403d]/30">
            {orderType === 'dine-in'
              ? '🍽️ Consumo en Mesa'
              : orderType === 'takeout'
              ? '🛍️ Para Llevar'
              : '🛵 Domicilio'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Bill Summary, Right = Payment and Numpad */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
        {/* LEFT COLUMN: Order Summary (The Bill) */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-[#202020] rounded-2xl border border-[#5b403d]/50 flex flex-col overflow-hidden shrink-0 shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-[#5b403d]/40 bg-[#1b1c1c] flex justify-between items-center">
            <div>
              <p className="text-xs text-[#ffb3ac] font-bold">Resumen de Comanda</p>
              <h3 className="text-lg font-extrabold text-white">Orden #{orderNumber}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#e4beba]/70 font-semibold">{tableName || 'Mesa 12'}</p>
              <p className="text-xs text-[#f8bd2a] font-bold">{customerName || 'Comensal'}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar divide-y divide-[#5b403d]/30">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white text-sm">
                    {item.quantity}x {item.name}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <p className="text-[#e4beba]/60 text-[11px]">
                      {item.selectedModifiers.map((m) => m.name).join(', ')}
                    </p>
                  )}
                </div>
                <span className="font-extrabold text-[#f8bd2a]">
                  {formatCOP(item.totalUnitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="p-4 bg-[#1b1c1c] border-t border-[#5b403d]/50 space-y-2">
            <div className="flex justify-between text-xs text-[#e4beba]">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCOP(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-xs text-[#7ddc7a]">
                <span>Descuento ({discountPercent}%)</span>
                <span className="font-bold">-{formatCOP(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-[#e4beba]">
              <span>IVA (19%)</span>
              <span className="font-semibold text-white">{formatCOP(tax)}</span>
            </div>

            <div className="flex justify-between text-xs text-[#e4beba] items-center">
              <span>Propina Servicio</span>
              <span className="font-semibold text-[#f8bd2a]">
                +{formatCOP(tipAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-[#5b403d]/40 pt-3">
              <span className="text-lg font-extrabold text-white">Total a Cobrar</span>
              <span
                id="total-amount-display"
                className="text-2xl font-black text-[#f8bd2a]"
              >
                {formatCOP(total)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tip, Numpad & Payment Methods */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {/* Tip Selection */}
          <div className="bg-[#202020] p-4 rounded-2xl border border-[#5b403d]/40 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4beba] mb-3">
              Seleccionar Propina de Servicio
            </h3>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleSelectTip(0)}
                className={`flex-1 h-11 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 0
                    ? 'border-[#d32f2f] bg-[#d32f2f]/20 text-white'
                    : 'border-[#5b403d]/40 bg-[#2a2a2a] text-[#e4beba] hover:border-[#f8bd2a]'
                }`}
              >
                Ninguna (0%)
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(10)}
                className={`flex-1 h-11 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 10
                    ? 'border-[#f8bd2a] bg-[#f8bd2a]/20 text-[#f8bd2a]'
                    : 'border-[#5b403d]/40 bg-[#2a2a2a] text-[#e4beba] hover:border-[#f8bd2a]'
                }`}
              >
                10% ({formatCOP((taxableAmount * 10) / 100)})
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(15)}
                className={`flex-1 h-11 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === 15
                    ? 'border-[#f8bd2a] bg-[#f8bd2a]/20 text-[#f8bd2a]'
                    : 'border-[#5b403d]/40 bg-[#2a2a2a] text-[#e4beba] hover:border-[#f8bd2a]'
                }`}
              >
                15% ({formatCOP((taxableAmount * 15) / 100)})
              </button>
              <button
                type="button"
                onClick={() => handleSelectTip(-1)}
                className={`flex-1 h-11 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedTipPercent === -1
                    ? 'border-[#f8bd2a] bg-[#f8bd2a]/20 text-[#f8bd2a]'
                    : 'border-[#5b403d]/40 bg-[#2a2a2a] text-[#e4beba] hover:border-[#f8bd2a]'
                }`}
              >
                {selectedTipPercent === -1 ? formatCOP(customTip) : 'Personalizada'}
              </button>
            </div>
          </div>

          {/* Main Interaction Area: Numpad + Payment Methods */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-[350px]">
            {/* Numpad Container */}
            <div className="w-full md:w-1/2 bg-[#202020] p-5 rounded-2xl border border-[#5b403d]/40 flex flex-col">
              {/* Tender Display */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-[#e4beba]/70 mb-1">
                  <span>Monto Recibido (Efectivo COP)</span>
                  <button
                    onClick={handleExactAmount}
                    className="text-[#f8bd2a] font-bold hover:underline"
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
                    className="w-full bg-[#131313] border-2 border-[#5b403d]/60 focus:border-[#f8bd2a] text-right font-black text-2xl text-white px-4 py-2.5 rounded-xl outline-none"
                  />
                </div>

                {/* Quick Bills COP ($50k, $100k, $200k) */}
                <div className="flex gap-2 mt-2">
                  {[50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handlePresetAmount(amt)}
                      className="flex-1 py-1 bg-[#2a2a2a] hover:bg-[#353535] border border-[#5b403d]/30 text-xs font-bold text-[#e4beba] rounded-lg cursor-pointer"
                    >
                      {formatCOP(amt)}
                    </button>
                  ))}
                </div>

                {/* Change or Remaining status indicator */}
                {paymentMethod === 'cash' && tenderAmountStr && (
                  <div className="mt-2 p-2 rounded-lg bg-[#2a2a2a] border border-[#5b403d]/30 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#e4beba]">
                      {tenderedNumeric >= total ? 'Cambio a Devolver:' : 'Faltante:'}
                    </span>
                    <span
                      className={`font-black text-sm ${
                        tenderedNumeric >= total ? 'text-[#7ddc7a]' : 'text-[#ffb3ac]'
                      }`}
                    >
                      {tenderedNumeric >= total ? formatCOP(change) : formatCOP(remaining)}
                    </span>
                  </div>
                )}
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-3 gap-2.5 flex-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleNumpadPress(digit)}
                    className="bg-[#2a2a2a] hover:bg-[#353535] active:scale-95 text-white font-extrabold text-xl rounded-xl transition-all shadow-sm border border-[#5b403d]/20 flex items-center justify-center cursor-pointer min-h-[48px]"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="bg-[#2a2a2a] hover:bg-[#d32f2f]/30 active:scale-95 text-[#ffb3ac] rounded-xl transition-all shadow-sm border border-[#5b403d]/20 flex items-center justify-center cursor-pointer min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-2xl">backspace</span>
                </button>
                <button
                  onClick={() => handleNumpadPress('0')}
                  className="bg-[#2a2a2a] hover:bg-[#353535] active:scale-95 text-white font-extrabold text-xl rounded-xl transition-all shadow-sm border border-[#5b403d]/20 flex items-center justify-center cursor-pointer min-h-[48px]"
                >
                  0
                </button>
                <button
                  onClick={() => handleNumpadPress('000')}
                  className="bg-[#2a2a2a] hover:bg-[#353535] active:scale-95 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm border border-[#5b403d]/20 flex items-center justify-center cursor-pointer min-h-[48px]"
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
                      ? 'bg-[#d32f2f]/20 border-[#d32f2f] text-white shadow-lg'
                      : 'bg-[#202020] border-[#5b403d]/40 text-[#e4beba] hover:border-[#f8bd2a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-[#f8bd2a]">
                    payments
                  </span>
                  <span className="font-bold text-sm">Efectivo</span>
                </button>

                {/* Card */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#d32f2f]/20 border-[#d32f2f] text-white shadow-lg'
                      : 'bg-[#202020] border-[#5b403d]/40 text-[#e4beba] hover:border-[#f8bd2a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-[#7ddc7a]">
                    credit_card
                  </span>
                  <span className="font-bold text-sm">Tarjeta / Datáfono</span>
                </button>

                {/* Transfer / Nequi / Daviplata */}
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer col-span-2 ${
                    paymentMethod === 'transfer'
                      ? 'bg-[#d32f2f]/20 border-[#d32f2f] text-white shadow-lg'
                      : 'bg-[#202020] border-[#5b403d]/40 text-[#e4beba] hover:border-[#f8bd2a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-[#ffb3ac]">
                    qr_code_2
                  </span>
                  <span className="font-bold text-sm">Transferencia (Nequi / Daviplata / QR)</span>
                </button>
              </div>

              {/* Split Bill Button */}
              <button
                onClick={() => setShowSplitModal(true)}
                className="w-full py-3 bg-[#2a2a2a] hover:bg-[#353535] border border-[#5b403d]/40 text-[#e4beba] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">call_split</span>
                <span>Dividir Cuenta por Comensales</span>
              </button>

              {/* Finish Order Primary Action Button */}
              <button
                id="btn-complete-checkout"
                onClick={handleCompleteOrder}
                className="w-full h-16 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-black text-lg rounded-2xl shadow-xl border border-[#ffb3ac]/40 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-lg">Dividir Cuenta de Comensales</h3>
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => setSplitWays(Math.max(2, splitWays - 1))}
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] text-white font-bold text-xl border border-[#5b403d]/40"
              >
                -
              </button>
              <span className="text-2xl font-black text-[#f8bd2a]">{splitWays} personas</span>
              <button
                onClick={() => setSplitWays(splitWays + 1)}
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] text-white font-bold text-xl border border-[#5b403d]/40"
              >
                +
              </button>
            </div>
            <div className="p-4 bg-[#1b1c1c] rounded-xl text-center border border-[#5b403d]/30">
              <p className="text-xs text-[#e4beba]/70">Cada persona paga:</p>
              <p className="text-2xl font-black text-[#7ddc7a] mt-1">
                {formatCOP(total / splitWays)}
              </p>
            </div>
            <button
              onClick={() => setShowSplitModal(false)}
              className="w-full py-3 bg-[#d32f2f] text-white font-bold text-xs rounded-xl"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
