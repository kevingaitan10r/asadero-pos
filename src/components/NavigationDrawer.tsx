import React from 'react';
import { ActiveTab } from '../types';

interface NavigationDrawerProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCloseDay: () => void;
  cartCount: number;
  pendingOrdersCount: number;
  lowStockCount?: number;
  // Hover & Responsiveness Props
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  activeTab,
  onTabChange,
  onOpenCloseDay,
  cartCount,
  pendingOrdersCount,
  lowStockCount = 0,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isPinned,
  onTogglePin,
  isOpenMobile,
  onCloseMobile
}) => {
  const isExpanded = isPinned || isHovered || isOpenMobile;

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. Left Edge Hotspot Trigger Strip */}
      {!isPinned && !isHovered && (
        <div
          onMouseEnter={onMouseEnter}
          className="fixed left-0 top-0 bottom-0 w-4 z-40 hidden lg:block cursor-pointer group"
          title="Pasa el cursor para abrir el menú ERP y POS"
        >
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-[#f8bd2a] rounded-full opacity-60 group-hover:opacity-100 group-hover:h-24 edge-trigger-pulse transition-all" />
        </div>
      )}

      {/* 3. Main Drawer Element */}
      <aside
        id="navigation-drawer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed lg:relative top-0 bottom-0 left-0 z-50 lg:z-20 h-full bg-[#1b1c1c] border-r border-[#5b403d]/40 flex flex-col py-4 shrink-0 select-none shadow-[6px_0_30px_rgba(0,0,0,0.6)] drawer-transition ${
          isOpenMobile
            ? 'translate-x-0 w-[280px] sm:w-[320px]'
            : 'lg:translate-x-0 -translate-x-full'
        } ${
          isExpanded
            ? 'lg:w-[300px] xl:w-[320px]'
            : 'lg:w-[72px] lg:px-2'
        }`}
      >
        {/* Top Header & Pin Toggle */}
        <div className={`px-4 mb-3 flex items-center justify-between ${!isExpanded ? 'lg:px-1 lg:justify-center' : ''}`}>
          {isExpanded ? (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#ffb3ac] opacity-90 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#7ddc7a] animate-pulse"></span>
                <span>ERP & POS Suite v2.5</span>
              </div>
              <h2 className="text-lg lg:text-xl font-black text-[#f8bd2a] tracking-tight">
                El Remix Asadero
              </h2>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center gap-1" title="ERP & POS Suite">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7ddc7a] animate-pulse"></span>
              <span className="text-[10px] font-extrabold text-[#f8bd2a]">ERP</span>
            </div>
          )}

          {/* Desktop Pin Toggle & Mobile Close Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePin}
              className={`hidden lg:flex w-8 h-8 rounded-lg items-center justify-center transition-all cursor-pointer ${
                isPinned
                  ? 'bg-[#d32f2f] text-white shadow-md'
                  : 'bg-[#2a2a2a] text-[#e4beba]/70 hover:text-white hover:bg-[#353535]'
              }`}
              title={isPinned ? 'Desfijar menú (auto-despliegue)' : 'Fijar menú permanentemente'}
            >
              <span className={`material-symbols-outlined text-lg ${isPinned ? 'filled' : ''}`}>
                keep
              </span>
            </button>

            <button
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg bg-[#2a2a2a] text-[#e4beba] flex items-center justify-center hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Links Grouped into POS vs ERP */}
        <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto custom-scrollbar">
          {/* SECTION 1: POS SUITE */}
          {isExpanded && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-[#f8bd2a]/80">
              🛒 Operación POS (Caja & Salón)
            </div>
          )}

          {/* Menu Tab */}
          <button
            onClick={() => handleSelectTab('menu')}
            title="Menú & Tomador de Pedidos"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'menu' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                restaurant_menu
              </span>
              {isExpanded && <span>Menú & Tomador</span>}
            </div>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black bg-[#f8bd2a] text-[#402d00] rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Orders / Tables Tab */}
          <button
            onClick={() => handleSelectTab('orders')}
            title="Mesas, Salón & KDS"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'orders' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                table_restaurant
              </span>
              {isExpanded && <span>Mesas & Cocina KDS</span>}
            </div>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black bg-[#10b981] text-white rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Checkout Tab */}
          <button
            onClick={() => handleSelectTab('checkout')}
            title="Pantalla de Cobro / Checkout"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer relative ${
              activeTab === 'checkout'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'checkout' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                point_of_sale
              </span>
              {isExpanded && <span>Caja & Cobro POS</span>}
            </div>
          </button>

          {/* SECTION 2: INTEGRAL ERP SUITE */}
          {isExpanded && (
            <div className="px-3 pt-4 pb-1 text-[10px] font-black uppercase tracking-widest text-[#3b82f6]/90 border-t border-[#382624]/60 mt-1">
              🏢 Suite ERP Integral
            </div>
          )}

          {/* Inventario & Stock */}
          <button
            onClick={() => handleSelectTab('inventory')}
            title="Inventario & Insumos"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer relative ${
              activeTab === 'inventory'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'inventory' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                inventory_2
              </span>
              {isExpanded && <span>Inventario & Stock</span>}
            </div>
            {lowStockCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black bg-[#d32f2f] text-white rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Escandallos & Costeo (Recipes) */}
          <button
            onClick={() => handleSelectTab('recipes')}
            title="Escandallos y Costeo de Recetas"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'recipes' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                menu_book
              </span>
              {isExpanded && <span>Costeo & Recetas</span>}
            </div>
          </button>

          {/* Compras & Proveedores */}
          <button
            onClick={() => handleSelectTab('procurement')}
            title="Compras y Proveedores"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'procurement'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'procurement' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                local_shipping
              </span>
              {isExpanded && <span>Compras & Proveedores</span>}
            </div>
          </button>

          {/* Personal & Turnos (RRHH) */}
          <button
            onClick={() => handleSelectTab('hr')}
            title="Personal, Turnos y Nómina"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'hr'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'hr' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                group
              </span>
              {isExpanded && <span>Personal & Turnos</span>}
            </div>
          </button>

          {/* CRM Clientes & Domicilios */}
          <button
            onClick={() => handleSelectTab('crm')}
            title="Clientes CRM & Domicilios"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'crm' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                diversity_3
              </span>
              {isExpanded && <span>Clientes & Fidelización</span>}
            </div>
          </button>

          {/* Gastos & Finanzas */}
          <button
            onClick={() => handleSelectTab('finances')}
            title="Control de Gastos y Rentabilidad"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'finances'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'finances' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                account_balance_wallet
              </span>
              {isExpanded && <span>Finanzas & P&L</span>}
            </div>
          </button>

          {/* Dashboard KPIs */}
          <button
            onClick={() => handleSelectTab('dashboard')}
            title="Dashboard y Analíticas"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'dashboard' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                analytics
              </span>
              {isExpanded && <span>Dashboard KPIs</span>}
            </div>
          </button>

          {/* Configuración ERP & Facturación */}
          <button
            onClick={() => handleSelectTab('settings')}
            title="Configuración ERP & Fiscal"
            className={`flex items-center ${
              isExpanded ? 'justify-between px-3' : 'justify-center px-0'
            } py-2.5 rounded-xl transition-all font-bold text-sm cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#d32f2f] text-white border border-[#ffb3ac] shadow-lg'
                : 'text-[#e4beba] hover:bg-[#353535]/70 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'settings' ? 'filled text-white' : 'text-[#ffb3ac]'}`}>
                settings
              </span>
              {isExpanded && <span>Configuración ERP</span>}
            </div>
          </button>
        </nav>

        {/* Close Day Action Button */}
        <div className="px-2 mt-2">
          <button
            id="btn-close-day"
            onClick={() => {
              onOpenCloseDay();
              if (isOpenMobile) onCloseMobile();
            }}
            title="Arqueo & Cierre de Caja"
            className={`w-full flex justify-center items-center gap-2 ${
              isExpanded ? 'h-11 px-4' : 'h-10 px-0'
            } bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs rounded-xl shadow-md border border-[#ffb3ac]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer`}
          >
            <span className="material-symbols-outlined text-lg">lock</span>
            {isExpanded && <span>Arqueo / Cierre de Caja</span>}
          </button>
        </div>

        {/* Shift and Cashier Info */}
        <div className={`mt-auto pt-2 border-t border-[#5b403d]/30 flex items-center ${
          isExpanded ? 'px-4 justify-between' : 'px-1 justify-center'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#353535] flex items-center justify-center border border-[#5b403d]/50 shrink-0">
              <span className="material-symbols-outlined text-[#ffb3ac] text-lg">
                account_circle
              </span>
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-[#e5e2e1] truncate">Kevin G. (Gerente ERP)</p>
                <p className="text-[10px] text-[#e4beba]/70">Turno Principal Activo</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
