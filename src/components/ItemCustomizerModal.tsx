import React, { useState } from 'react';
import { MenuItem, CartItemModifier } from '../types';
import { formatCOP } from '../utils/formatters';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#202020] border border-[#5b403d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header with image & name */}
        <div className="relative h-44 w-full bg-[#131313] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202020] via-black/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="px-2 py-0.5 text-xs font-bold uppercase bg-[#d32f2f] text-white rounded-md">
                PLU: {item.plu}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
            </div>
            <div className="bg-[#f8bd2a] text-[#402d00] font-extrabold px-3 py-1 rounded-lg text-base sm:text-lg">
              {formatCOP(item.price)}
            </div>
          </div>
        </div>

        {/* Modal Body / Modifiers */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          <p className="text-xs text-[#e4beba]/80 leading-relaxed">
            {item.description}
          </p>

          {/* Available Modifiers Groups */}
          {item.availableModifiers && item.availableModifiers.length > 0 && (
            <div className="space-y-4">
              {item.availableModifiers.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8bd2a]">
                      {group.name}
                    </h4>
                    {group.required && (
                      <span className="text-[10px] text-[#ffb3ac] font-bold">
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
                          className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#d32f2f]/20 border-[#d32f2f] text-white'
                              : 'bg-[#2a2a2a] border-[#5b403d]/40 text-[#e4beba] hover:bg-[#353535]'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#ffb3ac]">
                              {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            {opt.name}
                          </span>
                          {opt.price > 0 && (
                            <span className="text-[#f8bd2a] font-bold">
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
            <label className="text-xs font-bold uppercase tracking-wider text-[#e4beba]">
              Notas para la Cocina (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Bien tostado, salsa aparte, sin sal..."
              className="w-full bg-[#2a2a2a] border border-[#5b403d]/40 focus:border-[#f8bd2a] text-[#e5e2e1] px-3 py-2.5 rounded-xl text-xs outline-none"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-3 border-t border-[#5b403d]/30">
            <span className="text-sm font-bold text-white">Cantidad</span>
            <div className="flex items-center bg-[#2a2a2a] border border-[#5b403d]/50 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-[#e4beba] hover:bg-[#353535] active:bg-[#d32f2f] transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-extrabold text-white text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-[#e4beba] hover:bg-[#353535] active:bg-[#d32f2f] transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#1b1c1c] border-t border-[#5b403d]/40 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl border border-[#5b403d] text-[#e4beba] font-bold text-sm hover:bg-[#2a2a2a] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            <span>Agregar • {formatCOP(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
