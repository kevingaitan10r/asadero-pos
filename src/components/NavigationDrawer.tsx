import React from 'react';
import { ActiveTab } from '../types';
import { ShieldCheck, Lock, Unlock } from 'lucide-react';

interface NavigationDrawerProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCloseDay: () => void;
  cartCount: number;
  pendingOrdersCount: number;
  lowStockCount?: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isAdminUnlocked?: boolean;
  onRequestUnlockAdmin?: (targetTab: ActiveTab, targetTitle: string) => void;
  onLockAdmin?: () => void;
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
  onCloseMobile,
  isAdminUnlocked = false,
  onRequestUnlockAdmin,
  onLockAdmin
}) => {
  const isExpanded = isPinned || isHovered || isOpenMobile;

  const handleSelectTab = (tab: ActiveTab, isErpModule = false, moduleTitle = '') => {
    if (isErpModule && !isAdminUnlocked) {
      if (onRequestUnlockAdmin) {
        onRequestUnlockAdmin(tab, moduleTitle);
      }
      return;
    }

    onTabChange(tab);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const navItemClass = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    return `flex items-center ${
      isExpanded ? 'justify-between px-3.5' : 'justify-center px-0'
    } py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all duration-150 relative ${
      isActive
        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-black'
        : 'text-slate-600 dark:text-slate-300 hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white'
    }`;
  };

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. Left Edge Hotspot Trigger Strip */}
      {!isPinned && !isHovered && (
        <div
          onMouseEnter={onMouseEnter}
          className="fixed left-0 top-0 bottom-0 w-3 z-40 hidden lg:block cursor-pointer group"
          title="Pasa el cursor para desplegar el menú"
        >
          <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-14 bg-amber-500 rounded-full opacity-40 group-hover:opacity-100 group-hover:h-20 edge-trigger-pulse transition-all" />
        </div>
      )}

      {/* 3. Main Drawer Element */}
      <aside
        id="navigation-drawer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed lg:relative top-0 bottom-0 left-0 z-50 lg:z-20 h-full bg-surface border-r border-border-subtle flex flex-col py-4 shrink-0 select-none shadow-2xl lg:shadow-none drawer-transition ${
          isOpenMobile
            ? 'translate-x-0 w-[280px] sm:w-[300px]'
            : 'lg:translate-x-0 -translate-x-full'
        } ${
          isExpanded
            ? 'lg:w-[280px] xl:w-[290px]'
            : 'lg:w-[68px] lg:px-2'
        }`}
      >
        {/* Top Header & Pin Toggle */}
        <div className={`px-3.5 mb-3 flex items-center justify-between ${!isExpanded ? 'lg:px-1 lg:justify-center' : ''}`}>
          {isExpanded ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-border-subtle shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="MAXI Pollos 22"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                  MAXI <span className="text-red-600 dark:text-red-500">Pollos</span> <span className="text-amber-500">22</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Asadero & Grill</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center gap-1" title="MAXI Pollos 22">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-border-subtle flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="MAXI Pollos 22"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Desktop Pin Toggle & Mobile Close Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePin}
              className={`hidden lg:flex w-8 h-8 rounded-lg items-center justify-center transition-all cursor-pointer ${
                isPinned
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover border border-border-subtle'
              }`}
              title={isPinned ? 'Desfijar menú (modo auto-despliegue)' : 'Fijar menú permanentemente'}
            >
              <span className={`material-symbols-outlined text-lg ${isPinned ? 'filled' : ''}`}>
                keep
              </span>
            </button>

            <button
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg bg-surface-elevated text-slate-600 dark:text-slate-300 flex items-center justify-center hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Links Grouped into POS vs ERP */}
        <nav className="flex-1 flex flex-col gap-1 px-2.5 overflow-y-auto custom-scrollbar">
          {/* SECTION 1: POS SUITE */}
          {isExpanded && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Operación de Restaurante</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold border border-emerald-500/20">POS</span>
            </div>
          )}

          {/* Menu Tab */}
          <button
            onClick={() => handleSelectTab('menu')}
            title="Menú & Tomador de Pedidos"
            className={navItemClass('menu')}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'menu' ? 'filled text-white' : 'text-slate-400'}`}>
                restaurant_menu
              </span>
              {isExpanded && <span>Menú & Pedidos</span>}
            </div>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black bg-amber-400 text-amber-950 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Checkout Tab */}
          <button
            onClick={() => handleSelectTab('checkout')}
            title="Caja & Facturación POS"
            className={navItemClass('checkout')}
          >
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-xl ${activeTab === 'checkout' ? 'filled text-white' : 'text-slate-400'}`}>
                point_of_sale
              </span>
              {isExpanded && <span>Caja & Cobro POS</span>}
            </div>
          </button>

          {/* SECTION 2: INTEGRAL ERP SUITE (SHOWN ONLY WHEN UNLOCKED) */}
          {isAdminUnlocked ? (
            <>
              {isExpanded && (
                <div className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-t border-border-subtle mt-2 flex items-center justify-between">
                  <span>Gestión & ERP Suite</span>
                  <button
                    onClick={onLockAdmin}
                    className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-black border border-purple-500/30 flex items-center gap-1 hover:bg-purple-500/25 cursor-pointer transition-all"
                    title="Bloquear acceso ERP"
                  >
                    <Unlock size={11} /> Bloquear
                  </button>
                </div>
              )}

              {/* Dashboard KPIs */}
              <button
                onClick={() => handleSelectTab('dashboard')}
                title="Dashboard y Analíticas"
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'dashboard' ? 'filled text-white' : 'text-slate-400'}`}>
                    analytics
                  </span>
                  {isExpanded && <span>Dashboard KPIs</span>}
                </div>
              </button>

              {/* Inventario & Stock */}
              <button
                onClick={() => handleSelectTab('inventory')}
                title="Inventario & Insumos"
                className={navItemClass('inventory')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'inventory' ? 'filled text-white' : 'text-slate-400'}`}>
                    inventory_2
                  </span>
                  {isExpanded && <span>Inventario & Stock</span>}
                </div>
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white rounded-full">
                    {lowStockCount}
                  </span>
                )}
              </button>

              {/* Gastos & Finanzas */}
              <button
                onClick={() => handleSelectTab('finances')}
                title="Finanzas y Rentabilidad"
                className={navItemClass('finances')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'finances' ? 'filled text-white' : 'text-slate-400'}`}>
                    account_balance_wallet
                  </span>
                  {isExpanded && <span>Finanzas & P&L</span>}
                </div>
              </button>

              {/* Escandallos & Costeo (Recipes) */}
              <button
                onClick={() => handleSelectTab('recipes')}
                title="Costeo y Escandallos de Recetas"
                className={navItemClass('recipes')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'recipes' ? 'filled text-white' : 'text-slate-400'}`}>
                    menu_book
                  </span>
                  {isExpanded && <span>Costeo & Recetas</span>}
                </div>
              </button>

              {/* Compras & Proveedores */}
              <button
                onClick={() => handleSelectTab('procurement')}
                title="Compras y Proveedores"
                className={navItemClass('procurement')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'procurement' ? 'filled text-white' : 'text-slate-400'}`}>
                    local_shipping
                  </span>
                  {isExpanded && <span>Compras & Proveedores</span>}
                </div>
              </button>

              {/* Personal & Turnos (RRHH) */}
              <button
                onClick={() => handleSelectTab('hr')}
                title="Personal, Turnos y Nómina"
                className={navItemClass('hr')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'hr' ? 'filled text-white' : 'text-slate-400'}`}>
                    group
                  </span>
                  {isExpanded && <span>Personal & Turnos</span>}
                </div>
              </button>

              {/* Configuración ERP & Facturación */}
              <button
                onClick={() => handleSelectTab('settings')}
                title="Configuración ERP & Fiscal"
                className={navItemClass('settings')}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'settings' ? 'filled text-white' : 'text-slate-400'}`}>
                    settings
                  </span>
                  {isExpanded && <span>Configuración</span>}
                </div>
              </button>
            </>
          ) : (
            /* ERP Locked Quick Access Button */
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <button
                onClick={() => onRequestUnlockAdmin && onRequestUnlockAdmin('dashboard', 'Suite ERP')}
                className={`w-full flex items-center ${
                  isExpanded ? 'justify-between px-3 py-2.5' : 'justify-center py-2 px-0'
                } rounded-xl bg-surface-elevated hover:bg-purple-500/10 border border-border-subtle hover:border-purple-500/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer group shadow-xs`}
                title="Ingresar PIN de Administrador para ver Suite ERP"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-purple-500 group-hover:scale-110 transition-transform">
                    shield
                  </span>
                  {isExpanded && (
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Acceso ERP</span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">Desbloquear con PIN</span>
                    </div>
                  )}
                </div>
                {isExpanded && <Lock size={13} className="text-amber-500" />}
              </button>
            </div>
          )}
        </nav>

        {/* Close Day Action Button */}
        <div className="px-3 mt-2">
          <button
            id="btn-close-day"
            onClick={() => {
              onOpenCloseDay();
              if (isOpenMobile) onCloseMobile();
            }}
            title="Arqueo & Cierre de Caja"
            className={`w-full flex justify-center items-center gap-2 ${
              isExpanded ? 'h-10 px-3' : 'h-10 px-0'
            } bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95`}
          >
            <span className="material-symbols-outlined text-lg">lock</span>
            {isExpanded && <span>Arqueo / Cierre Caja</span>}
          </button>
        </div>

        {/* Shift and User Info */}
        <div className={`mt-auto pt-2.5 border-t border-border-subtle flex items-center ${
          isExpanded ? 'px-4 justify-between' : 'px-1 justify-center'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${isAdminUnlocked ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-red-600'} text-white flex items-center justify-center font-bold text-xs shadow shrink-0`}>
              {isAdminUnlocked ? <ShieldCheck size={16} /> : 'POS'}
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {isAdminUnlocked ? 'Administrador' : 'Terminal Salón'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isAdminUnlocked ? 'Acceso Total ERP' : 'Modo Atención al Cliente'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
