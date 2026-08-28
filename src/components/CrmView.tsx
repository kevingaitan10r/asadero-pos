import React, { useState } from 'react';
import { CustomerProfile, LoyaltyTier } from '../types';
import { formatCOP } from '../utils/formatters';
import {
  HeartHandshake,
  Star,
  Award,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Gift,
  XCircle,
  X,
  Check
} from 'lucide-react';

interface CrmViewProps {
  customers: CustomerProfile[];
  onAddCustomer: (newCustomer: CustomerProfile) => void;
  onSelectCustomerForOrder?: (customer: CustomerProfile) => void;
}

export function CrmView({
  customers,
  onAddCustomer,
  onSelectCustomerForOrder
}: CrmViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new customer
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('Pollo Entero');

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Ingresa el nombre y teléfono del cliente.');
      return;
    }

    const created: CustomerProfile = {
      id: 'cust-' + Date.now(),
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      address: address || 'Dirección de Entrega',
      favoriteDish: favoriteDish || 'Pollo Entero',
      loyaltyPoints: 50, // Welcome bonus points!
      tier: 'Bronce',
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: new Date().toISOString().split('T')[0]
    };

    onAddCustomer(created);
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const getTierBadge = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'VIP':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Award size={12} /> Cliente VIP ⭐⭐⭐
          </span>
        );
      case 'Oro':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Star size={12} fill="currentColor" /> Tier ORO
          </span>
        );
      case 'Plata':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gray-400/20 text-gray-300 border border-gray-400/30 flex items-center gap-1">
            <Star size={12} /> Tier PLATA
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-700/20 text-orange-300 border border-orange-700/30 flex items-center gap-1">
            <Gift size={12} /> Tier BRONCE
          </span>
        );
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-[#131313] p-4 lg:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <HeartHandshake size={24} className="text-[#f8bd2a]" />
            CRM y Fidelización de Clientes (ERP)
          </h1>
          <p className="text-xs text-[#a0a0a0] mt-0.5">
            Base de datos de comensales, historial de consumo, programa de puntos y domicilios
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#f8bd2a] hover:bg-[#e0a81e] text-[#402d00] text-xs font-black rounded-xl shadow transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} /> Registrar Cliente CRM
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o dirección de entrega..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] text-xs text-white rounded-xl border border-[#2a2a2a] focus:outline-none focus:border-[#f8bd2a]"
        />
      </div>

      {/* Customer Profiles Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {getTierBadge(cust.tier)}
                  <span className="text-xs font-bold text-[#f8bd2a] bg-[#f8bd2a]/10 px-2.5 py-1 rounded-full border border-[#f8bd2a]/30 flex items-center gap-1">
                    <Gift size={13} /> {cust.loyaltyPoints} Puntos
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{cust.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{cust.address}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#161616] rounded-xl border border-[#282828] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Histórico Consumido:</span>
                    <span className="font-bold text-white font-mono">{formatCOP(cust.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Pedidos:</span>
                    <span className="font-bold text-white">{cust.orderCount} visitas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plato Preferido:</span>
                    <span className="font-bold text-[#f8bd2a] truncate max-w-[140px]">
                      {cust.favoriteDish || 'Pollo Entero'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Último pedido: {cust.lastOrderDate}
                </span>

                {onSelectCustomerForOrder && (
                  <button
                    onClick={() => onSelectCustomerForOrder(cust)}
                    className="px-3 py-1.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow cursor-pointer"
                  >
                    <ShoppingBag size={14} /> Asignar a Venta POS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add New Customer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HeartHandshake size={18} className="text-[#f8bd2a]" />
                Registrar Cliente en Sistema CRM
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Camilo Andrés Restrepo"
                  className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Teléfono Móvil *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 310 000 0000"
                    className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Plato Favorito
                  </label>
                  <input
                    type="text"
                    value={favoriteDish}
                    onChange={(e) => setFavoriteDish(e.target.value)}
                    placeholder="Combo Familiar"
                    className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
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
                  placeholder="cliente@gmail.com"
                  className="w-full bg-[#262626] text-xs text-white p-2.5 rounded-xl border border-[#3a3a3a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Dirección Habitual Domicilios
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle 123 # 45-67, Apto 301"
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
                  className="px-5 py-2 bg-[#f8bd2a] hover:bg-[#e0a81e] text-[#402d00] text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  Registrar y Otorgar +50 Puntos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
