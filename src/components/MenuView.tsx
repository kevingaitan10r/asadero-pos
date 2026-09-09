import React, { useState } from 'react';
import { MenuItem, CategoryId, CartItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface MenuViewProps {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onSelectItem: (item: MenuItem) => void;
  onUpdateQuantity?: (cartItemId: string, newQty: number) => void;
  onCustomizeItem?: (item: MenuItem) => void;
  searchQuery: string;
}

interface SectionConfig {
  id: CategoryId;
  label: string;
  title: string;
  icon: string;
  notice?: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'pollos', label: 'Pollos', title: 'Pollos Fritos & Broster', icon: 'local_dining' },
  { id: 'combos', label: 'Combos', title: 'Combos Familiares', icon: 'set_meal' },
  { id: 'alacarta', label: 'A la Carta', title: 'Platos a la Carta', icon: 'dinner_dining', notice: 'Icopor para llevar: +$1.000' },
  { id: 'sopas', label: 'Sopas', title: 'Sopas Tradicionales', icon: 'soup_kitchen' },
  { id: 'adiciones', label: 'Adiciones', title: 'Adiciones & Acompañamientos', icon: 'tapas' },
  { id: 'bebidas', label: 'Bebidas', title: 'Bebidas, Refrescos & Cervezas', icon: 'local_drink' }
];

export const MenuView: React.FC<MenuViewProps> = ({
  menuItems,
  cartItems,
  onSelectItem,
  onUpdateQuantity,
  onCustomizeItem,
  searchQuery
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryId>('all');

  const getItemCartQuantity = (menuItemId: string) => {
    return cartItems
      .filter((ci) => ci.menuItemId === menuItemId)
      .reduce((acc, ci) => acc + ci.quantity, 0);
  };

  const handleDecrementItem = (item: MenuItem) => {
    if (!onUpdateQuantity) return;
    const matching = cartItems.filter((ci) => ci.menuItemId === item.id);
    if (matching.length > 0) {
      const last = matching[matching.length - 1];
      onUpdateQuantity(last.id, last.quantity - 1);
    }
  };

  // Search results
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching
    ? menuItems.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.plu.includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      })
    : [];

  const visibleSections = SECTIONS.filter(
    (sec) => activeFilter === 'all' || activeFilter === sec.id
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none bg-background">
      {/* Top Clean Category Bar with Horizontal Touch Chips */}
      <div className="bg-surface border-b border-border-subtle px-3 sm:px-4 py-2 flex items-center justify-between gap-2 shrink-0 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-surface-elevated text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-border-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>Todos</span>
          </button>

          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveFilter(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === sec.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-surface-elevated text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-border-subtle'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden lg:flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-xs text-amber-500">touch_app</span>
          <span>1 toque para agregar a comanda</span>
        </div>
      </div>

      {/* Main Single Page Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        {/* If Searching, show search results */}
        {isSearching ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Resultados para "{searchQuery}"
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {searchResults.length} productos encontrados
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">No se encontraron productos</p>
                <p className="text-xs text-slate-500 mt-1">Intente con otro nombre o código PLU</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {searchResults.map((item) => renderProductCard(item))}
              </div>
            )}
          </div>
        ) : (
          /* Entire Menu on One Continuous Page */
          visibleSections.map((sec) => {
            const items = menuItems.filter((item) => item.categoryId === sec.id);
            if (items.length === 0) return null;

            return (
              <div key={sec.id} id={`section-${sec.id}`} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-xl">
                      {sec.icon}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {sec.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      ({items.length})
                    </span>
                  </div>

                  {sec.notice && (
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">takeout_dining</span>
                      {sec.notice}
                    </span>
                  )}
                </div>

                {/* Quick Portion Selector for Pollos (Entero, 1/2, 1/4) */}
                {sec.id === 'pollos' && (
                  <div className="p-3.5 bg-surface-elevated/80 border border-red-500/20 rounded-2xl space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-red-600 text-sm">local_fire_department</span>
                        <span>Selección Rápida de Porciones (1 Toque)</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Entero, 1/2 y 1/4 de Pollo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {/* Pollo Frito Group */}
                      <div className="p-2.5 bg-surface rounded-xl border border-border-subtle space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-black text-red-600 dark:text-red-400">
                          <span>🍗 Pollo Frito Asadero</span>
                          <span className="text-[10px] text-slate-500 font-normal">Papa salada + Arepa</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {items
                            .filter((i) => i.id.includes('frito') && !i.id.includes('combo'))
                            .map((item) => {
                              const qty = getItemCartQuantity(item.id);
                              const label = item.id.includes('medio')
                                ? '1/2 Pollo'
                                : item.id.includes('cuarto')
                                ? '1/4 Pollo'
                                : '1 Entero';
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => onSelectItem(item)}
                                  className={`py-2 px-1.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-between active:scale-95 ${
                                    qty > 0
                                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                      : 'bg-surface-elevated hover:bg-surface-hover border-border-subtle text-slate-900 dark:text-white'
                                  }`}
                                >
                                  <span className="text-[11px] font-black uppercase">{label}</span>
                                  <span className="text-xs font-mono font-black mt-0.5">{formatCOP(item.price)}</span>
                                  {qty > 0 && (
                                    <span className="text-[9px] font-bold bg-white/20 px-1.5 rounded-full mt-0.5">
                                      {qty} en orden
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Pollo Broster Group */}
                      <div className="p-2.5 bg-surface rounded-xl border border-border-subtle space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400">
                          <span>🍗 Pollo Broster Crujiente</span>
                          <span className="text-[10px] text-slate-500 font-normal">Yuca + Arepa frita</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {items
                            .filter((i) => i.id.includes('broster') && !i.id.includes('combo'))
                            .map((item) => {
                              const qty = getItemCartQuantity(item.id);
                              const label = item.id.includes('medio')
                                ? '1/2 Broster'
                                : item.id.includes('cuarto')
                                ? '1/4 Broster'
                                : '1 Entero';
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => onSelectItem(item)}
                                  className={`py-2 px-1.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-between active:scale-95 ${
                                    qty > 0
                                      ? 'bg-amber-500 text-amber-950 font-black border-amber-500 shadow-sm'
                                      : 'bg-surface-elevated hover:bg-surface-hover border-border-subtle text-slate-900 dark:text-white'
                                  }`}
                                >
                                  <span className="text-[11px] font-black uppercase">{label}</span>
                                  <span className="text-xs font-mono font-black mt-0.5">{formatCOP(item.price)}</span>
                                  {qty > 0 && (
                                    <span className="text-[9px] font-bold bg-black/20 px-1.5 rounded-full mt-0.5">
                                      {qty} en orden
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid for this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {items.map((item) => renderProductCard(item))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  function renderProductCard(item: MenuItem) {
    const inCartQty = getItemCartQuantity(item.id);
    const isSelected = inCartQty > 0;

    // Portion tag for chickens
    const portionBadge =
      item.id === 'pollo-frito' || item.id === 'pollo-broster'
        ? 'Pollo Entero'
        : item.id.includes('medio')
        ? '1/2 Pollo'
        : item.id.includes('cuarto')
        ? '1/4 Pollo'
        : null;

    return (
      <div
        key={item.id}
        id={`item-card-${item.id}`}
        onClick={() => onSelectItem(item)}
        className={`bg-surface rounded-2xl overflow-hidden border transition-all duration-150 hover:shadow-md active:scale-[0.99] cursor-pointer group flex flex-col relative h-auto ${
          isSelected
            ? 'border-red-600 dark:border-red-500 ring-2 ring-red-500/20 shadow-xs'
            : 'border-border-subtle hover:border-red-400'
        }`}
      >
        {/* Card Image Container */}
        <div className="h-[110px] w-full relative bg-surface-elevated overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* In-Cart Floating Badge */}
          {inCartQty > 0 && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75">
              {inCartQty}
            </div>
          )}

          {/* Portion Badge if Chicken */}
          {portionBadge ? (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white rounded-lg font-black text-[10px] flex items-center gap-1 shadow-md">
              🍗 {portionBadge}
            </div>
          ) : item.isPopular ? (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 backdrop-blur-sm text-amber-950 rounded-lg font-black text-[10px] flex items-center gap-1 shadow-md">
              <span className="material-symbols-outlined text-xs">star</span>
              Favorito
            </div>
          ) : null}

          {/* PLU Tag */}
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/90 uppercase tracking-wider bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-md">
            PLU: {item.plu}
          </span>
        </div>

        {/* Card Info Content */}
        <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
              {item.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
              {item.description}
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
            <div className="text-slate-900 dark:text-white font-black text-sm sm:text-base leading-none font-mono">
              {formatCOP(item.price)}
            </div>

            {/* Quick Agile Controls */}
            {isSelected ? (
              <div className="flex items-center gap-1">
                {onCustomizeItem && item.availableModifiers && item.availableModifiers.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeItem(item);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-surface-elevated transition-colors cursor-pointer"
                    title="Opciones especiales (salsas, término, etc.)"
                  >
                    <span className="material-symbols-outlined text-sm">tune</span>
                  </button>
                )}

                <div className="flex items-center bg-surface-elevated rounded-xl border border-border-subtle overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrementItem(item);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-red-500/10 hover:text-red-600 transition-colors cursor-pointer active:scale-90"
                    title="Restar 1"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-6 text-center font-black text-xs text-slate-900 dark:text-white font-mono">
                    {inCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors cursor-pointer active:scale-90"
                    title="Sumar 1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {onCustomizeItem && item.availableModifiers && item.availableModifiers.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeItem(item);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-surface-elevated transition-colors cursor-pointer"
                    title="Opciones especiales"
                  >
                    <span className="material-symbols-outlined text-sm">tune</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="px-2.5 py-1.5 bg-surface-elevated group-hover:bg-red-600 group-hover:text-white text-slate-700 dark:text-slate-200 border border-border-subtle rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Pedir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
