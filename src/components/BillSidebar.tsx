import React, { useState } from 'react';
import { CartItem, OrderType } from '../types';
import { formatCOP } from '../utils/formatters';

interface BillSidebarProps {
  orderNumber: number;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  tableName: string;
  customerName: string;
  onSelectTable: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onEditItem: (cartItem: CartItem) => void;
  onProceedToPay: () => void;
  discountPercent: number;
  onApplyDiscount: (percent: number) => void;
  orderNote: string;
  onSetOrderNote: (note: string) => void;
  onClearCart: () => void;
  // Mobile / Responsive props
  isOpenMobileCart?: boolean;
  onCloseMobileCart?: () => void;
}

export const BillSidebar: React.FC<BillSidebarProps> = ({
  orderNumber,
  orderType,
  onOrderTypeChange,
  tableName,
  customerName,
  onSelectTable,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onEditItem,
  onProceedToPay,
  discountPercent,
  onApplyDiscount,
  orderNote,
  onSetOrderNote,
  onClearCart,
  isOpenMobileCart,
  onCloseMobileCart
}) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tempNote, setTempNote] = useState(orderNote);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.totalUnitPrice * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.19; // 19% IVA Colombia
  const total = taxableAmount + tax;

  const handleSaveNote = () => {
    onSetOrderNote(tempNote);
    setShowNoteModal(false);
  };

  const handleProceedPayAndCloseMobile = () => {
    onProceedToPay();
    if (onCloseMobileCart) onCloseMobileCart();
  };

  return (
    <>
      {/* Mobile Backdrop for Cart Sidebar */}
      {isOpenMobileCart && (
        <div
          onClick={onCloseMobileCart}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="bill-sidebar"
        className={`fixed lg:relative top-0 bottom-0 right-0 z-50 lg:z-20 w-full sm:w-[360px] lg:w-[340px] xl:w-[380px] bg-[#1b1c1c] border-l border-[#5b403d]/40 flex flex-col h-full shrink-0 shadow-[-6px_0_30px_rgba(0,0,0,0.6)] select-none drawer-transition ${
          isOpenMobileCart ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Bill Header */}
        <div className="p-4 sm:p-5 border-b border-[#5b403d]/40 bg-[#1b1c1c] space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              {onCloseMobileCart && (
                <button
                  onClick={onCloseMobileCart}
                  className="lg:hidden p-1 rounded-lg bg-[#2a2a2a] text-[#e4beba] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Order #{orderNumber}
              </h2>
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-[#ffb3ac] hover:text-red-400 font-bold hover:underline"
                  title="Vaciar orden"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Dine-In / Takeout / Delivery Switcher */}
            <div className="flex gap-1 bg-[#2a2a2a] p-1 rounded-lg border border-[#5b403d]/30">
              <button
                onClick={() => onOrderTypeChange('dine-in')}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'dine-in'
                    ? 'bg-[#f8bd2a] text-[#402d00]'
                    : 'text-[#e4beba]/70 hover:text-white'
                }`}
              >
                Mesa
              </button>
              <button
                onClick={() => onOrderTypeChange('takeout')}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'takeout'
                    ? 'bg-[#f8bd2a] text-[#402d00]'
                    : 'text-[#e4beba]/70 hover:text-white'
                }`}
              >
                Llevar
              </button>
              <button
                onClick={() => onOrderTypeChange('delivery')}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-[#f8bd2a] text-[#402d00]'
                    : 'text-[#e4beba]/70 hover:text-white'
                }`}
              >
                Domicilio
              </button>
            </div>
          </div>

          {/* Table and Customer selector pill */}
          <div
            onClick={onSelectTable}
            className="flex items-center justify-between p-2.5 bg-[#202020] hover:bg-[#2a2a2a] border border-[#5b403d]/30 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-[#e4beba]">
              <span className="material-symbols-outlined text-base text-[#ffb3ac]">
                table_restaurant
              </span>
              <span className="font-bold text-white">
                {tableName || 'Sin Mesa Asignada'}
              </span>
              <span className="text-[#e4beba]/60 truncate max-w-[120px]">
                • {customerName || 'Cliente Mostrador'}
              </span>
            </div>
            <span className="material-symbols-outlined text-xs text-[#f8bd2a]">
              arrow_forward_ios
            </span>
          </div>

          {/* Order note preview if exists */}
          {orderNote && (
            <div className="px-3 py-1.5 bg-[#d32f2f]/10 border border-[#d32f2f]/30 rounded-lg text-xs text-[#ffdad6] flex items-center justify-between">
              <span className="truncate">Nota: {orderNote}</span>
              <button
                onClick={() => onSetOrderNote('')}
                className="text-[#ffb3ac] font-bold text-xs ml-2 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Bill Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#e4beba]/50">
              <span className="material-symbols-outlined text-5xl mb-2 text-[#5b403d]">
                shopping_cart
              </span>
              <p className="text-sm font-bold text-[#e5e2e1]">La orden está vacía</p>
              <p className="text-xs text-[#e4beba]/60 mt-1">
                Selecciona productos del menú para agregarlos a la comanda.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#5b403d]/30">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-3 group relative hover:bg-[#202020]/40 -mx-2 px-2 rounded-xl transition-colors"
                >
                  {/* Item Name & Row Total */}
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white leading-snug w-3/4">
                      {item.name}
                    </h4>
                    <span className="text-sm font-extrabold text-[#f8bd2a]">
                      {formatCOP(item.totalUnitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Modifiers & Notes */}
                  {(item.selectedModifiers.length > 0 || item.notes) && (
                    <div className="flex flex-col gap-0.5 mb-2">
                      {item.selectedModifiers.map((m, idx) => (
                        <p
                          key={idx}
                          className="text-xs text-[#e4beba]/70 pl-2 border-l-2 border-[#d32f2f]/60"
                        >
                          - {m.name} {m.price > 0 ? `(+${formatCOP(m.price)})` : ''}
                        </p>
                      ))}
                      {item.notes && (
                        <p className="text-xs text-[#f8bd2a] pl-2 border-l-2 border-[#f8bd2a]">
                          - {item.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quantity Controls & Edit/Delete */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center bg-[#2a2a2a] rounded-lg border border-[#5b403d]/40 overflow-hidden">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#e4beba] hover:text-white hover:bg-[#353535] active:bg-[#d32f2f] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-8 text-center font-extrabold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#e4beba] hover:text-white hover:bg-[#353535] active:bg-[#d32f2f] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="text-[#e4beba]/70 hover:text-[#f8bd2a] p-1.5 rounded-lg hover:bg-[#353535] transition-colors cursor-pointer"
                        title="Editar opciones"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#e4beba]/70 hover:text-[#ffb3ac] p-1.5 rounded-lg hover:bg-[#353535] transition-colors cursor-pointer"
                        title="Eliminar producto"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill Totals & Actions Bottom Section */}
        <div className="bg-[#131313] p-4 sm:p-5 border-t border-[#5b403d]/50 shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
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

            <div className="flex justify-between items-center text-white font-bold border-t border-[#5b403d]/40 pt-2">
              <span className="text-sm sm:text-base tracking-tight">Total</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#f8bd2a] tracking-tight">
                {formatCOP(total)}
              </span>
            </div>
          </div>

          {/* Note and Discount Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                setTempNote(orderNote);
                setShowNoteModal(true);
              }}
              className="h-10 sm:h-11 rounded-xl border border-[#d32f2f] text-[#ffb3ac] font-bold text-xs uppercase tracking-wider hover:bg-[#d32f2f]/15 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">note_add</span>
              <span>Nota {orderNote ? '✓' : ''}</span>
            </button>

            <button
              onClick={() => setShowDiscountModal(true)}
              className="h-10 sm:h-11 rounded-xl border border-[#d32f2f] text-[#ffb3ac] font-bold text-xs uppercase tracking-wider hover:bg-[#d32f2f]/15 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">percent</span>
              <span>Desc {discountPercent > 0 ? `(${discountPercent}%)` : ''}</span>
            </button>
          </div>

          {/* Primary Checkout / Pay Button */}
          <button
            id="btn-pay-now"
            disabled={items.length === 0}
            onClick={handleProceedPayAndCloseMobile}
            className={`w-full h-12 sm:h-14 font-extrabold text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              items.length > 0
                ? 'bg-[#d32f2f] hover:bg-[#b71c1c] text-white active:scale-[0.98] shadow-red-950/60'
                : 'bg-[#353535] text-[#e4beba]/40 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">payments</span>
            <span>Pagar {formatCOP(total)}</span>
          </button>
        </div>

        {/* Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="font-bold text-white text-base">
                Agregar Nota General a la Orden
              </h3>
              <textarea
                rows={3}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Ej. Cumpleaños, enviar cubiertos extras, salsa en tarrina..."
                className="w-full bg-[#2a2a2a] border border-[#5b403d]/50 focus:border-[#f8bd2a] text-white p-3 rounded-xl text-xs outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-2.5 border border-[#5b403d] text-[#e4beba] rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-2.5 bg-[#d32f2f] text-white rounded-xl text-xs font-bold"
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discount Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202020] border border-[#5b403d] rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl">
              <h3 className="font-bold text-white text-base">Aplicar Descuento</h3>
              <div className="grid grid-cols-2 gap-2">
                {[0, 5, 10, 15, 20, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      onApplyDiscount(pct);
                      setShowDiscountModal(false);
                    }}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                      discountPercent === pct
                        ? 'bg-[#d32f2f] text-white border-red-400'
                        : 'bg-[#2a2a2a] text-[#e5e2e1] border-[#5b403d]/40 hover:bg-[#353535]'
                    }`}
                  >
                    {pct === 0 ? 'Sin Descuento' : `${pct}%`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="w-full py-2 text-xs text-[#e4beba]/70 hover:underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
