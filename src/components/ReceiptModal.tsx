import React from 'react';
import { Order, CompanySettings } from '../types';
import { formatCOP } from '../utils/formatters';

interface ReceiptModalProps {
  order: Order | null;
  settings?: CompanySettings;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  settings,
  isOpen,
  onClose,
  onNewOrder
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const companyName = settings?.companyName || 'EL REMIX ASADERO';
  const nit = settings?.nit || '901.482.910-4';
  const address = settings?.address || 'Calle 100 # 15-45, Zona Gastronómica';
  const phone = settings?.phone || '+57 (601) 745-9000';
  const resolution = settings?.posResolutionNumber || '18764039201948';
  const headerMsg = settings?.receiptHeaderMsg || '¡El mejor pollo al carbón con sabor artesanal!';
  const footerMsg = settings?.receiptFooterMsg || 'Gracias por su preferencia. Propina sugerida 10%.';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#202020] border-2 border-[#5b403d] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Receipt Paper Simulation */}
        <div className="p-6 bg-white text-black font-mono text-xs overflow-y-auto custom-scrollbar flex-1 space-y-3">
          {/* Brand header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
            <div className="text-xl font-black tracking-tight text-red-700 uppercase">
              {companyName}
            </div>
            <div className="text-[10px] text-gray-700 italic">{headerMsg}</div>
            <div className="text-[10px] text-gray-600">NIT: {nit}</div>
            <div className="text-[10px] text-gray-600">
              {address} • Tel: {phone}
            </div>
            <div className="text-[10px] text-gray-600">
              Res. POS DIAN No. {resolution}
            </div>
          </div>

          {/* Ticket Meta */}
          <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-gray-400">
            <div className="flex justify-between font-bold">
              <span>FACTURA VENTA POS:</span>
              <span>ORD-{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>FECHA / HORA:</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString('es-CO')}{' '}
                {new Date(order.createdAt).toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CLIENTE:</span>
              <span className="font-bold">{order.customerName || 'Comensal General'}</span>
            </div>
            <div className="flex justify-between">
              <span>MESA / SERVICIO:</span>
              <span>
                {order.tableName || 'Mesa'} (
                {order.type === 'dine-in'
                  ? 'Mesa'
                  : order.type === 'takeout'
                  ? 'Para Llevar'
                  : 'Domicilio'}
                )
              </span>
            </div>
            {order.serverName && (
              <div className="flex justify-between">
                <span>MESERO ATENDIÓ:</span>
                <span>{order.serverName}</span>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div className="space-y-2 pb-3 border-b border-dashed border-gray-400">
            <div className="flex justify-between font-bold text-[10px] text-gray-500 uppercase border-b border-gray-200 pb-1">
              <span>Cant / Descripción</span>
              <span>Total</span>
            </div>
            {order.items.map((it, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-semibold">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span>{formatCOP(it.totalUnitPrice * it.quantity)}</span>
                </div>
                {it.selectedModifiers.length > 0 && (
                  <div className="text-[10px] text-gray-600 pl-3">
                    {it.selectedModifiers.map((m) => m.name).join(', ')}
                  </div>
                )}
                {it.notes && (
                  <div className="text-[10px] text-gray-600 italic pl-3">
                    *{it.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span>{formatCOP(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-700">
                <span>DESCUENTO:</span>
                <span>-{formatCOP(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>INC / IVA:</span>
              <span>{formatCOP(order.tax)}</span>
            </div>
            {order.tip > 0 && (
              <div className="flex justify-between">
                <span>PROPINA VOLUNTARIA:</span>
                <span>+{formatCOP(order.tip)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-1 border-t border-gray-300">
              <span>TOTAL A PAGAR:</span>
              <span>{formatCOP(order.total)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>FORMA DE PAGO:</span>
              <span className="font-bold uppercase">
                {order.paymentMethod === 'cash'
                  ? 'EFECTIVO'
                  : order.paymentMethod === 'card'
                  ? 'TARJETA DÉBITO/CRÉDITO'
                  : 'TRANSFERENCIA QR'}
              </span>
            </div>
            {order.paymentMethod === 'cash' && order.paidAmount && (
              <>
                <div className="flex justify-between">
                  <span>RECIBIDO:</span>
                  <span>{formatCOP(order.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-800">
                  <span>CAMBIO:</span>
                  <span>{formatCOP(order.change || 0)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer message */}
          <div className="text-center text-[10px] text-gray-600 space-y-1 pt-2">
            <p className="font-bold">{footerMsg}</p>
            <p className="tracking-widest">|||||||||||||||||||||||||||||</p>
            <p className="text-[8px]">Sistema ERP & POS El Remix v2.5</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-[#1b1c1c] border-t border-[#5b403d]/40 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-[#2a2a2a] hover:bg-[#353535] text-white font-bold text-xs rounded-xl border border-[#5b403d]/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Imprimir Ticket</span>
          </button>
          <button
            onClick={() => {
              onNewOrder();
              onClose();
            }}
            className="flex-1 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>
    </div>
  );
};
