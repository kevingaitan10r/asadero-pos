import React, { useState } from 'react';
import { CompanySettings } from '../types';
import {
  Settings,
  Building,
  FileCheck,
  Percent,
  Receipt,
  Gift,
  Save,
  CheckCircle2
} from 'lucide-react';

interface SettingsViewProps {
  settings: CompanySettings;
  onSaveSettings: (updatedSettings: CompanySettings) => void;
}

export function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [form, setForm] = useState<CompanySettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#131313] p-4 lg:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <Settings size={24} className="text-[#f8bd2a]" />
            Configuración ERP y Facturación POS
          </h1>
          <p className="text-xs text-[#a0a0a0] mt-0.5">
            Parámetros fiscales, resolución de facturación POS / DIAN, impuestos y formato de recibos
          </p>
        </div>

        {isSaved && (
          <div className="px-4 py-2 bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} /> ¡Configuración guardada exitosamente!
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-6 max-w-4xl"
      >
        {/* Section 1: Business Fiscal Profile */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <Building size={18} className="text-[#f8bd2a]" />
            1. Perfil Empresarial y Datos Fiscales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Razón Social / Nombre Comercial *
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                NIT / RUT Fiscal *
              </label>
              <input
                type="text"
                required
                value={form.nit}
                onChange={(e) => setForm({ ...form, nit: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Dirección Comercial Principal
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Teléfono de Contacto POS
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Correo Electrónico de Facturación
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Régimen Fiscal
              </label>
              <input
                type="text"
                value={form.regimenFiscal}
                onChange={(e) => setForm({ ...form, regimenFiscal: e.target.value })}
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#f8bd2a]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Electronic / Fiscal Resolution */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <FileCheck size={18} className="text-[#3b82f6]" />
            2. Resolución de Facturación POS / DIAN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Número de Resolución DIAN / Fiscal
              </label>
              <input
                type="text"
                value={form.posResolutionNumber}
                onChange={(e) =>
                  setForm({ ...form, posResolutionNumber: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#3b82f6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Prefijo de Comprobantes POS
              </label>
              <input
                type="text"
                value={form.posResolutionPrefix}
                onChange={(e) =>
                  setForm({ ...form, posResolutionPrefix: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#3b82f6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Rango Autorizado de Numeración
              </label>
              <input
                type="text"
                value={form.posResolutionRange}
                onChange={(e) =>
                  setForm({ ...form, posResolutionRange: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Fecha de Emisión de Resolución
              </label>
              <input
                type="date"
                value={form.posResolutionDate}
                onChange={(e) =>
                  setForm({ ...form, posResolutionDate: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Taxes & Loyalty */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <Percent size={18} className="text-[#10b981]" />
            3. Impuestos y Programa de Fidelización
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                % Impuesto Nacional al Consumo (INC)
              </label>
              <input
                type="number"
                value={form.impuestoConsumoPercent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    impuestoConsumoPercent: parseFloat(e.target.value) || 0
                  })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                % IVA General (Si Aplica)
              </label>
              <input
                type="number"
                value={form.ivaPercent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ivaPercent: parseFloat(e.target.value) || 0
                  })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-[#f8bd2a]" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Activar Programa de Fidelización de Puntos CRM
                </span>
                <span className="text-[11px] text-gray-400">
                  Otorga 1 punto por cada $1.000 COP consumidos por clientes registrados
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={form.enableLoyaltyProgram}
              onChange={(e) =>
                setForm({ ...form, enableLoyaltyProgram: e.target.checked })
              }
              className="w-5 h-5 accent-[#d32f2f] cursor-pointer"
            />
          </div>
        </div>

        {/* Section 4: Printed Receipt Customization */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <Receipt size={18} className="text-purple-400" />
            4. Mensajes Personalizados en Recibo / Tiquete POS
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Mensaje de Encabezado (Bajo el Logo)
              </label>
              <input
                type="text"
                value={form.receiptHeaderMsg}
                onChange={(e) =>
                  setForm({ ...form, receiptHeaderMsg: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Mensaje de Pie de Página (Agradecimiento o Leyenda)
              </label>
              <input
                type="text"
                value={form.receiptFooterMsg}
                onChange={(e) =>
                  setForm({ ...form, receiptFooterMsg: e.target.value })
                }
                className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 pb-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-sm font-black rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save size={18} /> Guardar Configuración ERP
          </button>
        </div>
      </form>
    </div>
  );
}
