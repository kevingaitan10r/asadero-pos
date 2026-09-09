import React, { useState, useEffect } from 'react';
import { AuthUser, InventoryItem } from '../types';

interface TopAppBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTableName?: string;
  onSelectTableClick?: () => void;
  onOpenMobileNav?: () => void;
  isNavPinned?: boolean;
  onToggleNavPin?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isAdminUnlocked?: boolean;
  onLockAdmin?: () => void;
  onRequestUnlockAdmin?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  lowStockItems?: InventoryItem[];
  onNavigateToInventory?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTableName,
  onSelectTableClick,
  onOpenMobileNav,
  isNavPinned,
  onToggleNavPin,
  theme = 'dark',
  onToggleTheme,
  isAdminUnlocked = false,
  onLockAdmin,
  onRequestUnlockAdmin,
  currentUser,
  onLogout,
  lowStockItems = [],
  onNavigateToInventory
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Alertas dinámicas reales: Únicamente insumos con stock por debajo del mínimo
  const inventoryAlerts = lowStockItems.filter(
    (item) => item.stockQuantity <= item.minStockThreshold
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-CO', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      );
      setDate(
        now.toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="top-app-bar"
      className="w-full bg-surface/90 backdrop-blur-md border-b border-border-subtle flex justify-between items-center px-4 sm:px-6 h-[68px] lg:h-[72px] shrink-0 z-30 relative select-none gap-2 sm:gap-4 transition-colors duration-200"
    >
      {/* Left Group: Mobile Hamburger, Pin Toggle & Brand */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden w-10 h-10 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-red-600 dark:text-red-400 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Abrir menú de navegación"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        )}

        {/* Desktop Drawer Pin Quick Toggle Button */}
        {onToggleNavPin && (
          <button
            onClick={onToggleNavPin}
            className="hidden lg:flex w-9 h-9 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-600 dark:text-slate-300 hover:text-red-500 items-center justify-center transition-all cursor-pointer"
            title={isNavPinned ? 'Desfijar menú lateral (Modo Hover activado)' : 'Fijar menú lateral'}
          >
            <span className="material-symbols-outlined text-xl">
              {isNavPinned ? 'push_pin' : 'start'}
            </span>
          </button>
        )}

        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-0.5 border border-border-subtle shrink-0">
            <img
              src="/logo.png"
              alt="MAXI Pollos 22"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-1 text-slate-900 dark:text-white">
                MAXI <span className="text-red-600 dark:text-red-500">Pollos</span> <span className="text-amber-500">22</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Bar (Desktop & Tablet) */}
      <div className="flex-1 max-w-md xl:max-w-lg px-2 hidden md:block">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">
            search
          </span>
          <input
            id="search-menu-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por platillo, código o PLU (ej. Pollo, 101)..."
            className="w-full bg-surface-elevated border border-border-subtle focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-slate-100 pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls (Mode Lock Button, Theme Toggle, Active Table, Clock, Notifications) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Admin Unlock / Lock Button */}
        {isAdminUnlocked ? (
          <button
            onClick={onLockAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Cerrar sesión de administrador y proteger ERP"
          >
            <span className="material-symbols-outlined text-sm">lock_open</span>
            <span className="hidden sm:inline">Bloquear ERP</span>
          </button>
        ) : (
          <button
            onClick={onRequestUnlockAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Ingresar PIN de administrador para abrir ERP"
          >
            <span className="material-symbols-outlined text-sm text-purple-500">shield</span>
            <span className="hidden sm:inline">Acceso ERP</span>
          </button>
        )}
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden w-9 h-9 rounded-xl bg-surface-elevated border border-border-subtle text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-700 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}


        {/* Clock */}
        <div className="hidden sm:flex flex-col items-end px-2 py-0.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{date || 'Hoy'}</span>
          <span
            id="live-clock"
            className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 font-mono tracking-wider"
          >
            {time || '12:00:00'}
          </span>
        </div>

        {/* Real Inventory Alerts Button (Only for Admin) */}
        {currentUser?.role === 'admin' && (
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated hover:bg-surface-hover transition-all flex items-center justify-center relative cursor-pointer border shadow-sm ${
                inventoryAlerts.length > 0
                  ? 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10'
                  : 'text-slate-500 dark:text-slate-400 border-border-subtle'
              }`}
              title="Alertas de Inventario Bajo"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">
                {inventoryAlerts.length > 0 ? 'warning' : 'inventory_2'}
              </span>
              {inventoryAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {inventoryAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-surface border border-border-medium rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-red-600 text-base">warning</span>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Alertas de Inventario Crítico
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600/15 text-red-600 dark:text-red-400 border border-red-600/30">
                    {inventoryAlerts.length} {inventoryAlerts.length === 1 ? 'insumo' : 'insumos'}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {inventoryAlerts.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 space-y-1">
                      <span className="material-symbols-outlined text-2xl text-emerald-500">check_circle</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Todo el inventario está en niveles óptimos
                      </p>
                      <p className="text-[10px] text-slate-400">
                        No hay insumos por debajo del umbral mínimo.
                      </p>
                    </div>
                  ) : (
                    inventoryAlerts.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-surface-elevated rounded-xl text-xs border border-red-500/20 flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono font-black text-[10px]">
                            {Number(item.stockQuantity.toFixed(2))} {item.unit}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                          <span>Mínimo requerido: {item.minStockThreshold} {item.unit}</span>
                          <span className="text-red-600 dark:text-red-400 font-bold">⚠️ Reabastecer</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {onNavigateToInventory && (
                  <button
                    onClick={() => {
                      onNavigateToInventory();
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Gestionar Inventario & Compras</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Active User Profile & Logout Button */}
        {currentUser && (
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-border-subtle">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-elevated border border-border-subtle">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 ${
                  currentUser.role === 'admin' ? 'bg-amber-600' : 'bg-red-600'
                }`}
              >
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                  {currentUser.role === 'admin' ? 'Administrador' : 'Mesero'}
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-xl bg-surface-elevated hover:bg-red-500/10 hover:text-red-600 text-slate-500 border border-border-subtle flex items-center justify-center transition-all cursor-pointer"
                title="Cerrar Sesión / Salir"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-full bg-surface border-b border-border-medium p-3 md:hidden z-30 shadow-xl flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar platillo o PLU..."
            className="flex-1 bg-surface-elevated border border-border-subtle text-slate-900 dark:text-white px-3 py-2 text-xs rounded-xl outline-none"
          />
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs text-red-600 dark:text-red-400 px-2 py-1 font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}
    </header>
  );
};
