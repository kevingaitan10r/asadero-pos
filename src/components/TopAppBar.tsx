import React, { useState, useEffect } from 'react';

interface TopAppBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTableName?: string;
  onSelectTableClick?: () => void;
  // Hover & Responsiveness Props
  onOpenMobileNav?: () => void;
  isNavPinned?: boolean;
  onToggleNavPin?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTableName,
  onSelectTableClick,
  onOpenMobileNav,
  isNavPinned,
  onToggleNavPin
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
          minute: '2-digit',
          second: '2-digit'
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
      className="w-full bg-[#131313] border-b border-[#5b403d]/40 flex justify-between items-center px-4 sm:px-6 h-[70px] lg:h-[76px] shrink-0 z-30 relative select-none gap-2 sm:gap-4"
    >
      {/* Left Group: Mobile Hamburger, Brand & Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#202020] hover:bg-[#2a2a2a] border border-[#5b403d]/40 text-[#ffb3ac] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Abrir menú de navegación"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        )}

        {/* Desktop Drawer Pin Quick Toggle Button */}
        {onToggleNavPin && (
          <button
            onClick={onToggleNavPin}
            className="hidden lg:flex w-9 h-9 rounded-xl bg-[#202020] hover:bg-[#2a2a2a] border border-[#5b403d]/40 text-[#ffb3ac] items-center justify-center transition-all cursor-pointer"
            title={isNavPinned ? 'Desfijar menú lateral (Modo Hover activado)' : 'Fijar menú lateral'}
          >
            <span className="material-symbols-outlined text-xl">
              {isNavPinned ? 'push_pin' : 'start'}
            </span>
          </button>
        )}

        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#d32f2f]/20 border border-[#d32f2f]/50 flex items-center justify-center text-[#ffb3ac] shadow-inner shrink-0">
            <span className="material-symbols-outlined text-2xl sm:text-3xl">restaurant</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#d32f2f] tracking-tight flex items-center gap-1">
                Asadero <span className="text-[#f8bd2a]">POS</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#20812c]/30 text-[#7ddc7a] border border-[#7ddc7a]/40 rounded-full">
                v2.5 Brasa
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#e4beba]/70 font-medium hidden sm:block">
              Sabor Tradicional & Carbón
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar (Desktop & Tablet) */}
      <div className="flex-1 max-w-md xl:max-w-xl px-2 hidden md:block">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#e4beba]/60 text-xl">
            search
          </span>
          <input
            id="search-menu-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, código o PLU (ej. Pollo, 101)..."
            className="w-full bg-[#2a2a2a] border border-[#5b403d]/40 focus:border-[#f8bd2a] focus:ring-1 focus:ring-[#f8bd2a] text-[#e5e2e1] pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl transition-all placeholder:text-[#e4beba]/40 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#e4beba]/60 hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls (Active Table Badge, Clock, Notifications) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden w-9 h-9 rounded-xl bg-[#202020] border border-[#5b403d]/30 text-[#e4beba] flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>

        {/* Active Table Pill */}
        {activeTableName && onSelectTableClick && (
          <button
            onClick={onSelectTableClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f8bd2a]/20 border border-[#f8bd2a]/50 text-[#f8bd2a] rounded-lg text-xs font-bold hover:bg-[#f8bd2a]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">table_restaurant</span>
            <span className="truncate max-w-[80px] sm:max-w-none">{activeTableName}</span>
          </button>
        )}

        {/* System Online Status Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#202020] border border-[#5b403d]/30 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7ddc7a] shadow-[0_0_10px_#7ddc7a] animate-pulse"></span>
          <span className="text-xs font-bold text-[#e5e2e1]">Sistema Online</span>
        </div>

        {/* Clock */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[11px] font-bold text-[#e5e2e1]">{date || 'Oct 24, 2026'}</span>
          <span
            id="live-clock"
            className="text-xs sm:text-sm font-extrabold text-[#f8bd2a] tracking-wider"
          >
            {time || '14:32:45'}
          </span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#353535] hover:bg-[#2a2a2a] transition-all flex items-center justify-center text-[#e5e2e1] relative cursor-pointer border border-[#5b403d]/30"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d32f2f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#131313]">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#202020] border border-[#5b403d] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#5b403d]/40 mb-3">
                <h4 className="font-bold text-sm text-[#e5e2e1]">Alertas de Cocina</h4>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-[#ffb3ac] hover:underline"
                >
                  Limpiar todas
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#e4beba]/60 text-center py-4">
                    No hay notificaciones pendientes.
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#2a2a2a] rounded-xl text-xs text-[#e5e2e1] border border-[#5b403d]/20 flex items-start gap-2"
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
        <div className="absolute left-0 right-0 top-full bg-[#1b1c1c] border-b border-[#5b403d]/50 p-3 md:hidden z-30 shadow-xl flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar platillo o PLU..."
            className="flex-1 bg-[#2a2a2a] border border-[#5b403d]/50 text-white px-3 py-2 text-xs rounded-xl outline-none"
          />
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs text-[#ffb3ac] px-2 py-1 font-bold"
          >
            Cerrar
          </button>
        </div>
      )}
    </header>
  );
};
