import React, { useState } from 'react';
import { MenuItem, CategoryId, SubCategoryFilter, CartItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface MenuViewProps {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onSelectItem: (item: MenuItem) => void;
  searchQuery: string;
}

export const MenuView: React.FC<MenuViewProps> = ({
  menuItems,
  cartItems,
  onSelectItem,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('pollos');
  const [subFilter, setSubFilter] = useState<SubCategoryFilter>('all');

  const categories: { id: CategoryId; label: string; icon: string }[] = [
    { id: 'pollos', label: 'Pollos', icon: 'local_dining' },
    { id: 'combos', label: 'Combos', icon: 'set_meal' },
    { id: 'acompanamientos', label: 'Acompaña...', icon: 'tapas' },
    { id: 'bebidas', label: 'Bebidas', icon: 'local_drink' },
    { id: 'postres', label: 'Postres', icon: 'icecream' }
  ];

  // Filtering logic
  const filteredItems = menuItems.filter((item) => {
    // Search query filter takes precedence
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.plu.includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (item.categoryId !== selectedCategory) return false;

    // Sub filter
    if (subFilter === 'spicy') return item.isSpicy;
    if (subFilter === 'traditional') return item.subCategory === 'traditional';
    if (subFilter === 'combos') return item.categoryId === 'combos';
    if (subFilter === 'familiar') return item.subCategory === 'familiar';
    if (subFilter === 'individual') return item.subCategory === 'individual';

    return true;
  });

  // Calculate how many of each item is currently in cart
  const getItemCartQuantity = (menuItemId: string) => {
    return cartItems
      .filter((ci) => ci.menuItemId === menuItemId)
      .reduce((acc, ci) => acc + ci.quantity, 0);
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden select-none">
      {/* Sub-Categories Vertical Nav */}
      <nav
        id="subcategories-nav"
        className="w-28 sm:w-32 bg-[#0e0e0e] border-r border-[#5b403d]/30 flex flex-col py-4 overflow-y-auto hide-scrollbar shrink-0"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id && !searchQuery.trim();
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSubFilter('all');
              }}
              className={`flex flex-col items-center justify-center py-5 px-2 gap-2 transition-all cursor-pointer relative group ${
                isActive
                  ? 'text-[#ffb3ac] border-r-4 border-[#d32f2f] bg-[#202020] font-bold'
                  : 'text-[#e4beba]/70 hover:bg-[#202020]/60 hover:text-[#f8bd2a]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl transition-transform group-hover:scale-110 ${
                  isActive ? 'filled text-[#d32f2f]' : ''
                }`}
              >
                {cat.icon}
              </span>
              <span className="text-xs text-center font-bold tracking-tight">
                {cat.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Menu Grid Canvas */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 hide-scrollbar bg-gradient-to-br from-[#131313] to-[#0e0e0e] flex flex-col">
        {/* Category Header & Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-white capitalize tracking-tight flex items-center gap-2">
              {searchQuery.trim()
                ? `Resultados para "${searchQuery}"`
                : selectedCategory === 'pollos'
                ? 'Pollos Asados al Carbón'
                : selectedCategory === 'combos'
                ? 'Combos & Especiales'
                : selectedCategory === 'acompanamientos'
                ? 'Acompañamientos Tradicionales'
                : selectedCategory === 'bebidas'
                ? 'Bebidas & Refrescos'
                : 'Postres Artesanales'}
            </h2>
            <p className="text-xs text-[#e4beba]/70 mt-0.5">
              {filteredItems.length} opciones disponibles para orden inmediata
            </p>
          </div>

          {!searchQuery.trim() && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subFilter === 'all'
                    ? 'bg-[#353535] text-white border border-[#ffb3ac]/50 shadow'
                    : 'border border-[#5b403d]/40 text-[#e4beba] hover:bg-[#2a2a2a]'
                }`}
              >
                Todos
              </button>
              {selectedCategory === 'pollos' && (
                <>
                  <button
                    onClick={() => setSubFilter('spicy')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      subFilter === 'spicy'
                        ? 'bg-[#d32f2f] text-white border border-red-400'
                        : 'border border-[#5b403d]/40 text-[#e4beba] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">local_fire_department</span>
                    Picante
                  </button>
                  <button
                    onClick={() => setSubFilter('traditional')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subFilter === 'traditional'
                        ? 'bg-[#f8bd2a] text-[#402d00] font-extrabold'
                        : 'border border-[#5b403d]/40 text-[#e4beba] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Tradicional
                  </button>
                </>
              )}
              {selectedCategory === 'combos' && (
                <>
                  <button
                    onClick={() => setSubFilter('familiar')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subFilter === 'familiar'
                        ? 'bg-[#f8bd2a] text-[#402d00] font-extrabold'
                        : 'border border-[#5b403d]/40 text-[#e4beba] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Familiares
                  </button>
                  <button
                    onClick={() => setSubFilter('individual')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subFilter === 'individual'
                        ? 'bg-[#f8bd2a] text-[#402d00] font-extrabold'
                        : 'border border-[#5b403d]/40 text-[#e4beba] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Personales
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-[#e4beba]/30 mb-3">
              search_off
            </span>
            <h3 className="text-lg font-bold text-white">No se encontraron productos</h3>
            <p className="text-xs text-[#e4beba]/60 mt-1 max-w-sm">
              Intenta con otro término de búsqueda o selecciona otra categoría de la barra lateral.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {filteredItems.map((item) => {
              const inCartQty = getItemCartQuantity(item.id);
              return (
                <div
                  key={item.id}
                  id={`item-card-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="bg-[#202020] rounded-2xl overflow-hidden border border-transparent hover:border-[#d32f2f] transition-all hover:shadow-[0_8px_20px_rgba(211,47,47,0.2)] active:scale-[0.98] cursor-pointer group flex flex-col relative h-[310px]"
                >
                  {/* Card Image Container */}
                  <div className="h-[165px] w-full relative bg-[#131313] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202020] via-transparent to-black/20 opacity-90"></div>

                    {/* Quantity In-Cart Badge */}
                    {inCartQty > 0 && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[#d32f2f] text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-xl border-2 border-[#202020] animate-in zoom-in-50">
                        {inCartQty}
                      </div>
                    )}

                    {/* Spicy Badge */}
                    {item.isSpicy && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#93000a] text-[#ffdad6] rounded-md font-bold text-[11px] flex items-center gap-1 shadow-md border border-[#ffb4ab]/30">
                        <span className="material-symbols-outlined text-xs">
                          local_fire_department
                        </span>
                        Picante
                      </div>
                    )}

                    {/* Popular Badge */}
                    {item.isPopular && !item.isSpicy && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#f8bd2a] text-[#402d00] rounded-md font-extrabold text-[11px] flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-xs">star</span>
                        Favorito
                      </div>
                    )}

                    {/* PLU Tag */}
                    <span className="absolute bottom-2 left-3 text-[10px] font-bold text-[#e4beba]/70 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded">
                      PLU: {item.plu}
                    </span>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-4 flex flex-col flex-1 bg-[#202020] justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-[#f8bd2a] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#e4beba]/70 line-clamp-2 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-between items-center pt-2 border-t border-[#5b403d]/20">
                      <span className="px-2.5 py-0.5 bg-[#f8bd2a]/15 text-[#f8bd2a] rounded-lg text-xs font-bold border border-[#f8bd2a]/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        {item.prepTime}
                      </span>
                      <div className="bg-[#f8bd2a] text-[#402d00] px-3 py-1 rounded-lg font-black text-base sm:text-lg leading-none shadow-sm group-hover:bg-[#ffdfa0] transition-colors">
                        {formatCOP(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
