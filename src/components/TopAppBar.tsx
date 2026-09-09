import React, { useState, useEffect } from 'react';

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
  onRequestUnlockAdmin
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    '🔥 Horno 1 alcanzó temperatura óptima (220°C)',
    '🍗 Lote de 12 pollos listo para servir',
    '🔔 Mesa 3 solicitó la cuenta'
  ]);

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

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated hover:bg-surface-hover transition-all flex items-center justify-center text-slate-700 dark:text-slate-200 relative cursor-pointer border border-border-subtle shadow-sm"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-surface border border-border-medium rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Alertas de Cocina</h4>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer font-bold"
                >
                  Limpiar todas
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                    No hay notificaciones pendientes.
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-surface-elevated rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-border-subtle flex items-start gap-2"
                    >
                      <span>{n}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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
