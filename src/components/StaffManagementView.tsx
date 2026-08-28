import React, { useState } from 'react';
import { StaffMember, StaffRole } from '../types';
import { formatCOP } from '../utils/formatters';
import {
  Users,
  UserCheck,
  Clock,
  Award,
  DollarSign,
  Plus,
  ShieldCheck,
  Flame,
  Utensils,
  Search,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

interface StaffManagementViewProps {
  staffList: StaffMember[];
  onToggleClockIn: (staffId: string) => void;
  onAddStaffMember: (newStaff: StaffMember) => void;
}

export function StaffManagementView({
  staffList,
  onToggleClockIn,
  onAddStaffMember
}: StaffManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New staff form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('mesero');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(8500);

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Ingresa el nombre del colaborador.');
      return;
    }

    const created: StaffMember = {
      id: 'staff-' + Date.now(),
      name,
      role,
      phone: phone || '+57 300 000 0000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@asadero.com`,
      hourlyRate: hourlyRate || 8500,
      shiftStatus: 'clocked_out',
      salesCount: 0,
      totalSalesAmount: 0,
      rating: 5.0
    };

    onAddStaffMember(created);
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  // Helper for role icon & label
  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <ShieldCheck size={12} /> Admin General
          </span>
        );
      case 'cajero':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <DollarSign size={12} /> Cajero / Facturación
          </span>
        );
      case 'parrillero':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Flame size={12} /> Maestro Parrillero
          </span>
        );
      case 'mesero':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Utensils size={12} /> Mesero de Salón
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-300 border border-gray-500/30">
            {role}
          </span>
        );
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOnShiftCount = staffList.filter(
    (s) => s.shiftStatus === 'clocked_in'
  ).length;

  const totalTeamSales = staffList.reduce((sum, s) => sum + s.totalSalesAmount, 0);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#131313] p-4 lg:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <Users size={24} className="text-[#f8bd2a]" />
            Personal, Turnos y Rendimiento (RRHH ERP)
          </h1>
          <p className="text-xs text-[#a0a0a0] mt-0.5">
            Control de asistencia en tiempo real, atribución de ventas y gestión de equipo
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Registrar Colaborador
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#2a2a2a] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#10b981] flex items-center justify-center font-bold">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Personal en Turno</span>
            <span className="text-xl font-black text-white">{activeOnShiftCount} de {staffList.length}</span>
          </div>
        </div>

        <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#2a2a2a] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f8bd2a]/10 text-[#f8bd2a] flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Ventas Atribuidas Equipo</span>
            <span className="text-xl font-black text-[#f8bd2a] font-mono">{formatCOP(totalTeamSales)}</span>
          </div>
        </div>

        <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#2a2a2a] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Promedio Calificación</span>
            <span className="text-xl font-black text-white">4.9 / 5.0 ⭐</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar colaborador por nombre o rol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] text-xs text-white rounded-xl border border-[#2a2a2a] focus:outline-none focus:border-[#f8bd2a]"
        />
      </div>

      {/* Staff Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => {
            const isClockedIn = staff.shiftStatus === 'clocked_in';

            return (
              <div
                key={staff.id}
                className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {getRoleBadge(staff.role)}
                    {isClockedIn ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 flex items-center gap-1">
                        <CheckCircle2 size={11} /> EN TURNO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-600/20 text-gray-400 border border-gray-600/30 flex items-center gap-1">
                        <XCircle size={11} /> FORA DE TURNO
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{staff.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{staff.email}</p>
                  <p className="text-xs text-gray-400">{staff.phone}</p>

                  <div className="mt-4 p-3 bg-[#161616] rounded-xl border border-[#282828] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tarifa / Hora:</span>
                      <span className="font-bold text-white font-mono">{formatCOP(staff.hourlyRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Órdenes Atendidas:</span>
                      <span className="font-bold text-white">{staff.salesCount} órdenes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Facturado:</span>
                      <span className="font-bold text-[#f8bd2a] font-mono">{formatCOP(staff.totalSalesAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {isClockedIn ? `Hora inicio: ${staff.lastClockIn || '08:00 AM'}` : 'Sin marcar entrada'}
                  </span>

                  <button
                    onClick={() => onToggleClockIn(staff.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                      isClockedIn
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40'
                        : 'bg-[#10b981] text-white hover:bg-[#059669]'
                    }`}
                  >
                    {isClockedIn ? 'Marcar Salida' : 'Marcar Entrada'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Staff Member */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-[#f8bd2a]" />
                Registrar Nuevo Colaborador
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Andrés Felipe Silva"
                  className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Rol en el Asadero / Restaurante
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                >
                  <option value="mesero">Mesero de Salón</option>
                  <option value="cajero">Cajero / Cobro</option>
                  <option value="parrillero">Maestro Parrillero</option>
                  <option value="repartidor">Repartidor / Domiciliario</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 310 000 0000"
                    className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Valor Hora (COP)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@asadero.com"
                  className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#2a2a2a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#2a2a2a] text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Registrar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
