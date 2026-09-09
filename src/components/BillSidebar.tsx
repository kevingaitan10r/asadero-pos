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
  isOpenMobileCart?: boolean;
  onCloseMobileCart?: () => void;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliveryNotes?: string;
  onOpenDeliveryModal?: () => void;
  onDismiss?: () => void;
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
  onCloseMobileCart,
  deliveryAddress,
  deliveryPhone,
  deliveryNotes,
  onOpenDeliveryModal,
  onDismiss
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
    if (orderType === 'delivery' && !deliveryAddress?.trim() && onOpenDeliveryModal) {
      onOpenDeliveryModal();
      return;
    }
    onProceedToPay();
    if (onCloseMobileCart) onCloseMobileCart();
  };

  const handleSelectDelivery = () => {
    onOrderTypeChange('delivery');
    if (!deliveryAddress?.trim() && onOpenDeliveryModal) {
      onOpenDeliveryModal();
    }
  };

  return (
    <>
      {/* Mobile Backdrop for Cart Sidebar */}
      {isOpenMobileCart && (
        <div
          onClick={onCloseMobileCart}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="bill-sidebar"
        className={`fixed lg:relative top-0 bottom-0 right-0 z-50 lg:z-20 w-full sm:w-[350px] lg:w-[330px] xl:w-[360px] bg-surface border-l border-border-subtle flex flex-col h-full shrink-0 shadow-2xl lg:shadow-none select-none drawer-transition animate-in slide-in-from-right-5 duration-200 ${
          isOpenMobileCart ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Bill Header */}
        <div className="p-4 border-b border-border-subtle bg-surface space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {onCloseMobileCart && (
                <button
                  onClick={onCloseMobileCart}
                  className="lg:hidden p-1 rounded-lg bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="hidden lg:flex p-1 rounded-lg bg-surface-elevated text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  title="Minimizar comanda"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              )}
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Orden #{orderNumber}
              </h2>
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer ml-1"
                  title="Vaciar orden"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Takeout / Delivery Switcher */}
            <div className="flex gap-1 bg-surface-elevated p-1 rounded-xl border border-border-subtle">
              <button
                onClick={() => onOrderTypeChange('takeout')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  orderType !== 'delivery'
                    ? 'bg-amber-400 text-amber-950 font-black shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Para Llevar
              </button>
              <button
                onClick={handleSelectDelivery}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  orderType === 'delivery'
                    ? 'bg-red-600 text-white font-black shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Domicilio</span>
              </button>
            </div>
          </div>

          {/* Delivery Details Pill (Only shown for delivery) */}
          {orderType === 'delivery' && (
            <div
              onClick={onOpenDeliveryModal}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                deliveryAddress
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
                  : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <span className="material-symbols-outlined text-base text-red-600 dark:text-red-400">
                    two_wheeler
                  </span>
                  <span>PEDIDO A DOMICILIO</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 underline">
                  {deliveryAddress ? 'Cambiar Dirección' : '⚠️ Ingresar Dirección'}
                </span>
              </div>
              {deliveryAddress ? (
                <div className="mt-1.5 space-y-0.5 text-xs">
                  <p className="font-black text-slate-900 dark:text-white truncate">
                    📍 {deliveryAddress}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span>👤 {customerName || 'Cliente Domicilio'}</span>
                    {deliveryPhone && <span>• 📞 {deliveryPhone}</span>}
                  </div>
                  {deliveryNotes && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 italic truncate">
                      *{deliveryNotes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add_location_alt</span>
                  <span>Toca aquí para ingresar la dirección de entrega</span>
                </p>
              )}
            </div>
          )}

          {/* Order note preview if exists */}
          {orderNote && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
              <span className="truncate font-semibold">Nota: {orderNote}</span>
              <button
                onClick={() => onSetOrderNote('')}
                className="text-red-500 font-bold text-xs ml-2 hover:text-red-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Bill Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center text-slate-400 mb-2 border border-border-subtle">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Comanda vacía</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                Selecciona platillos del menú para agregarlos a la orden.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-3 group relative hover:bg-surface-elevated/60 -mx-2 px-2 rounded-xl transition-colors"
                >
                  {/* Item Name & Row Total */}
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug w-3/4">
                      {item.name}
                    </h4>
                    <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                      {formatCOP(item.totalUnitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Modifiers & Notes */}
                  {(item.selectedModifiers.length > 0 || item.notes) && (
                    <div className="flex flex-col gap-0.5 mb-2">
                      {item.selectedModifiers.map((m, idx) => (
                        <p
                          key={idx}
                          className="text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-red-500"
                        >
                          - {m.name} {m.price > 0 ? `(+${formatCOP(m.price)})` : ''}
                        </p>
                      ))}
                      {item.notes && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 pl-2 border-l-2 border-amber-500 font-semibold">
                          - {item.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quantity Controls & Edit/Delete */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center bg-surface-elevated rounded-xl border border-border-subtle overflow-hidden">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-surface-hover hover:text-red-500 active:scale-95 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-7 text-center font-black text-xs text-slate-900 dark:text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-surface-hover hover:text-emerald-500 active:scale-95 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="text-slate-400 hover:text-amber-500 p-1.5 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
                        title="Editar opciones"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
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
        <div className="bg-surface-elevated p-4 border-t border-border-subtle shadow-sm shrink-0">
          <div className="space-y-1.5 mb-3">
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
              <span>IVA / INC (19%)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">{formatCOP(tax)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-900 dark:text-white font-bold border-t border-border-subtle pt-2">
              <span className="text-sm tracking-tight font-black">Total</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-tight font-mono">
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
              className="h-9 rounded-xl border border-border-subtle bg-surface hover:bg-surface-hover text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-amber-500">note_add</span>
              <span>Nota {orderNote ? '✓' : ''}</span>
            </button>

            <button
              onClick={() => setShowDiscountModal(true)}
              className="h-9 rounded-xl border border-border-subtle bg-surface hover:bg-surface-hover text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-amber-500">percent</span>
              <span>Desc {discountPercent > 0 ? `(${discountPercent}%)` : ''}</span>
            </button>
          </div>

          {/* Primary Checkout / Pay Button */}
          <button
            id="btn-pay-now"
            disabled={items.length === 0}
            onClick={handleProceedPayAndCloseMobile}
            className={`w-full h-12 font-black text-base rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
              items.length > 0
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-xl">payments</span>
            <span>Cobrar {formatCOP(total)}</span>
          </button>
        </div>

        {/* Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border-medium rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Agregar Nota General a la Orden
              </h3>
              <textarea
                rows={3}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Ej. Cumpleaños, enviar cubiertos extras, salsa en tarrina..."
                className="w-full bg-surface-elevated border border-border-subtle focus:border-amber-500 text-slate-900 dark:text-white p-3 rounded-xl text-xs outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-2.5 border border-border-subtle text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-surface-hover cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discount Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border-medium rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Aplicar Descuento</h3>
              <div className="grid grid-cols-2 gap-2">
                {[0, 5, 10, 15, 20, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      onApplyDiscount(pct);
                      setShowDiscountModal(false);
                    }}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      discountPercent === pct
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-surface-elevated text-slate-700 dark:text-slate-200 border-border-subtle hover:bg-surface-hover'
                    }`}
                  >
                    {pct === 0 ? 'Sin Descuento' : `${pct}%`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="w-full py-2 text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
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
