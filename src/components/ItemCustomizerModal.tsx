import React, { useState } from 'react';
import { MenuItem, CartItemModifier } from '../types';
import { formatCOP } from '../utils/formatters';
import { CheckCircle2, Circle, ShoppingBag, X } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    modifiers: CartItemModifier[],
    notes: string
  ) => void;
  initialQuantity?: number;
  initialModifiers?: CartItemModifier[];
  initialNotes?: string;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  initialQuantity = 1,
  initialModifiers = [],
  initialNotes = ''
}) => {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedModifiers, setSelectedModifiers] =
    useState<CartItemModifier[]>(initialModifiers);
  const [notes, setNotes] = useState(initialNotes);

  const toggleModifier = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    price: number,
    isRadio = false
  ) => {
    if (isRadio) {
      const filtered = selectedModifiers.filter((m) => m.groupId !== groupId);
      setSelectedModifiers([
        ...filtered,
        { groupId, groupName, optionId, name: optionName, price }
      ]);
    } else {
      const exists = selectedModifiers.some(
        (m) => m.groupId === groupId && m.optionId === optionId
      );
      if (exists) {
        setSelectedModifiers(
          selectedModifiers.filter(
            (m) => !(m.groupId === groupId && m.optionId === optionId)
          )
        );
      } else {
        setSelectedModifiers([
          ...selectedModifiers,
          { groupId, groupName, optionId, name: optionName, price }
        ]);
      }
    }
  };

  const modifiersTotal = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
  const unitPrice = item.price + modifiersTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, quantity, selectedModifiers, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="bg-surface border border-border-medium rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header with image & name */}
        <div className="relative h-44 w-full bg-surface-elevated shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded-md">
                PLU: {item.plu}
              </span>
              <h3 className="text-xl font-black text-white mt-1 drop-shadow-sm">{item.name}</h3>
            </div>
            <div className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-xl text-base sm:text-lg shadow-md font-mono">
              {formatCOP(item.price)}
            </div>
          </div>
        </div>

        {/* Modal Body / Modifiers */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.description}
          </p>

          {/* Available Modifiers Groups */}
          {item.availableModifiers && item.availableModifiers.length > 0 && (
            <div className="space-y-4">
              {item.availableModifiers.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {group.name}
                    </h4>
                    {group.required && (
                      <span className="text-[10px] text-red-500 font-bold">
                        Requerido
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedModifiers.some(
                        (m) => m.groupId === group.id && m.optionId === opt.id
                      );
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            toggleModifier(
                              group.id,
                              group.name,
                              opt.id,
                              opt.name,
                              opt.price,
                              group.required
                            )
                          }
                          className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400 shadow-xs'
                              : 'bg-surface-elevated border-border-subtle text-slate-700 dark:text-slate-300 hover:bg-surface-hover'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isSelected ? (
                              <CheckCircle2 size={15} className="text-red-500 shrink-0" />
                            ) : (
                              <Circle size={15} className="text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{opt.name}</span>
                          </span>
                          {opt.price > 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-black font-mono">
                              +{formatCOP(opt.price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Special Instructions / Kitchen Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Notas para la Cocina (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Bien tostado, salsa aparte, sin sal..."
              className="w-full bg-surface-elevated border border-border-subtle focus:border-amber-500 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs outline-none"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Cantidad</span>
            <div className="flex items-center bg-surface-elevated border border-border-subtle rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-surface-hover active:bg-red-600 active:text-white transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center font-black text-slate-900 dark:text-white text-base font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-surface-hover active:bg-red-600 active:text-white transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-surface-elevated border-t border-border-subtle flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl border border-border-subtle text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-surface-hover transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer font-mono"
          >
            <ShoppingBag size={16} />
            <span>Agregar • {formatCOP(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
