import React, { useState } from 'react';
import { AuthUser } from '../types';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { Lock, User, KeyRound, AlertCircle, ArrowRight, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(identifier, password);
      if (result.error || !result.user) {
        setError(result.error || 'Error al iniciar sesión');
      } else {
        onLoginSuccess(result.user);
      }
    } catch {
      setError('Ocurrió un error al procesar el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  // Quick one-tap testing helper for phones
  const handleQuickLogin = async (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError(null);
    setLoading(true);
    const res = await authService.login(user, pass);
    setLoading(false);
    if (res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Error en acceso rápido');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-md bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Logo */}
        <div className="p-6 text-center border-b border-border-subtle bg-surface-elevated/40">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-border-subtle mx-auto mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="MAXI Pollos 22" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            MAXI <span className="text-red-600 dark:text-red-500">Pollos</span> <span className="text-amber-500">22</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            Sistema POS & ERP • Control de Acceso por Roles
          </p>

          {/* Supabase Status Indicator */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border">
            {isSupabaseConfigured ? (
              <span className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-1">
                <CheckCircle2 size={12} /> Supabase PostgreSQL Conectado
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 flex items-center gap-1">
                <Smartphone size={12} /> Modo Móvil & Pruebas Activo
              </span>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 font-bold animate-in shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Usuario o Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ej. carlos o admin"
                className="w-full bg-surface-elevated border border-border-subtle rounded-2xl pl-10 pr-4 py-3.5 text-slate-900 dark:text-white font-bold text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-elevated border border-border-subtle rounded-2xl pl-10 pr-4 py-3.5 text-slate-900 dark:text-white font-bold text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Iniciando sesión...</span>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Bar for Fast Testing */}
        <div className="p-4 bg-surface-elevated/50 border-t border-border-subtle">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center mb-2.5">
            ⚡ Acceso Rápido para Pruebas:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border-subtle text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                <ShieldCheck size={14} className="text-amber-500" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                POS + ERP Completo
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('carlos', 'mesero123')}
              className="p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border-subtle text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                <Smartphone size={14} className="text-red-500" />
                <span>Mesero (Carlos)</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Solo Pedidos Móvil
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

