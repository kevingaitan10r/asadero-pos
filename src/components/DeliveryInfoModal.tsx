import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, FileText, Check } from 'lucide-react';

interface DeliveryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddress?: string;
  initialPhone?: string;
  initialCustomerName?: string;
  initialNotes?: string;
  onSave: (data: {
    address: string;
    phone: string;
    customerName: string;
    notes: string;
  }) => void;
}

export const DeliveryInfoModal: React.FC<DeliveryInfoModalProps> = ({
  isOpen,
  onClose,
  initialAddress = '',
  initialPhone = '',
  initialCustomerName = '',
  initialNotes = '',
  onSave
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAddress(initialAddress);
      setPhone(initialPhone);
      setCustomerName(initialCustomerName || 'Cliente Domicilio');
      setNotes(initialNotes);
      setError('');
    }
  }, [isOpen, initialAddress, initialPhone, initialCustomerName, initialNotes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('La dirección de entrega es obligatoria para el domiciliario');
      return;
    }

    onSave({
      address: address.trim(),
      phone: phone.trim(),
      customerName: customerName.trim() || 'Cliente Domicilio',
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-surface border border-border-medium rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-surface-elevated border-b border-border-subtle flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">two_wheeler</span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Datos del Domicilio
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Se imprimirán en el tiquete del repartidor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer border border-border-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Dirección (Obligatoria) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" />
              <span>Dirección de Entrega *</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: Calle 45 # 12-34 Apto 302, Barrio Centro"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-surface-elevated border border-border-medium rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>

          {/* Teléfono y Cliente en 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone size={14} className="text-amber-500" />
                <span>Teléfono / Celular</span>
              </label>
              <input
                type="tel"
                placeholder="Ej: 310 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-elevated border border-border-medium rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User size={14} className="text-blue-500" />
                <span>Nombre del Cliente</span>
              </label>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-elevated border border-border-medium rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Indicaciones para el Domiciliario */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              <span>Indicaciones para el Domiciliario (Opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Timbre 302, reja blanca. Llevar cambio de $50.000 o datáfono"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-elevated border border-border-medium rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
            />
          </div>

          {/* Quick Notice about 2 tickets */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-2 text-amber-800 dark:text-amber-300 text-xs">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">receipt_long</span>
            <div>
              <p className="font-extrabold">Doble Tiquete Automático:</p>
              <p className="text-[11px] opacity-90">
                Al confirmar el pago se generará el <strong>Tiquete 1 para el Domiciliario</strong> (con la dirección y factura) y el <strong>Tiquete 2 para Control de Caja</strong> (archivo interno).
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-surface-elevated hover:bg-surface-hover text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-border-subtle cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Check size={16} />
              <span>Guardar Domicilio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

