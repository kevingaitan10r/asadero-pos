import React, { useState } from 'react';
import { Order, CompanySettings } from '../types';
import { formatCOP } from '../utils/formatters';
import { Printer, PlusCircle, X, Bike, FileCheck } from 'lucide-react';

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
  const [activeView, setActiveView] = useState<'both' | 'driver' | 'admin'>('both');

  if (!isOpen || !order) return null;

  const isDelivery = order.type === 'delivery';

  const handlePrint = () => {
    window.print();
  };

  const companyName = settings?.companyName || 'MAXI POLLOS 22';
  const nit = settings?.nit || '901.482.910-4';
  const address = settings?.address || 'Calle 100 # 15-45, Zona Gastronómica';
  const phone = settings?.phone || '+57 (601) 745-9000';
  const resolution = settings?.posResolutionNumber || '18764039201948';
  const headerMsg = settings?.receiptHeaderMsg || '¡El mejor pollo asado y a la brasa con tradición!';
  const footerMsg = settings?.receiptFooterMsg || 'Gracias por su preferencia. Propina voluntaria sugerida 10%.';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in zoom-in-95 duration-150">
      <div className={`bg-surface border border-border-medium rounded-3xl w-full ${isDelivery ? 'max-w-3xl' : 'max-w-sm'} overflow-hidden shadow-2xl flex flex-col max-h-[94vh]`}>
        {/* Top bar with close button */}
        <div className="p-3.5 bg-surface-elevated border-b border-border-subtle flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {isDelivery ? 'Comprobante Domicilio (Doble Tiquete)' : 'Comprobante de Venta POS'}
            </span>
            {isDelivery && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Bike size={12} />
                <span>2 Tiquetes</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDelivery && (
              <div className="hidden sm:flex bg-surface p-0.5 rounded-xl border border-border-subtle text-xs font-bold">
                <button
                  onClick={() => setActiveView('both')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeView === 'both' ? 'bg-red-600 text-white font-black' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Ver Ambos
                </button>
                <button
                  onClick={() => setActiveView('driver')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeView === 'driver' ? 'bg-red-600 text-white font-black' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🛵 Domiciliario
                </button>
                <button
                  onClick={() => setActiveView('admin')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeView === 'admin' ? 'bg-red-600 text-white font-black' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  📋 Archivo Caja
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-surface hover:bg-surface-hover text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer border border-border-subtle"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Informative notice for delivery */}
        {isDelivery && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5 font-bold">
              <FileCheck size={14} className="text-amber-600" />
              <span>Doble impresión lista: Copia 1 para entrega con el repartidor y Copia 2 para archivo de caja.</span>
            </span>
          </div>
        )}

        {/* Printable Ticket Area */}
        <div id="receipt-print-area" className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-900/50 overflow-y-auto custom-scrollbar flex-1">
          <div className={`flex flex-col ${isDelivery && activeView === 'both' ? 'md:flex-row' : 'max-w-sm mx-auto'} gap-6 justify-center items-start`}>
            
            {/* TICKET 1: COPIA DOMICILIARIO Y CLIENTE */}
            {(activeView === 'both' || activeView === 'driver') && (
              <div className="w-full md:max-w-sm bg-white text-slate-900 font-mono text-xs p-5 rounded-2xl shadow-lg border border-slate-200 space-y-3 print:shadow-none print:border-none print:m-0 print:p-2">
                {/* Delivery Badge Header */}
                {isDelivery && (
                  <div className="bg-red-600 text-white text-center py-1 px-2 rounded-lg font-black text-xs uppercase tracking-wider mb-2">
                    🛵 COPIA DOMICILIARIO / CLIENTE
                  </div>
                )}

                {/* Brand header */}
                <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
                  <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                    <img src="/logo.png" alt="MAXI Pollos 22" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-base font-black tracking-tight text-red-600 uppercase">
                    {companyName}
                  </div>
                  <div className="text-[10px] text-slate-600 italic">{headerMsg}</div>
                  <div className="text-[10px] text-slate-600">NIT: {nit}</div>
                  <div className="text-[10px] text-slate-600">{address} • Tel: {phone}</div>
                  <div className="text-[9px] text-slate-500">Res. POS DIAN No. {resolution}</div>
                </div>

                {/* DESTACADO DE DOMICILIO PARA EL REPARTIDOR */}
                {isDelivery && (
                  <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl space-y-1 text-slate-900">
                    <div className="text-[11px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1 border-b border-amber-200 pb-1">
                      <span>📍 DATOS DE ENTREGA:</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 pt-0.5 leading-snug">
                      DIRECCIÓN: {order.deliveryAddress || 'Sin dirección registrada'}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      TELÉFONO: {order.deliveryPhone || 'Sin teléfono'}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      CLIENTE: {order.customerName || 'Cliente Domicilio'}
                    </div>
                    {order.deliveryNotes && (
                      <div className="text-[11px] text-amber-900 bg-amber-100/80 p-1.5 rounded-md font-bold mt-1">
                        NOTAS: {order.deliveryNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Ticket Meta */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
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
                  {!isDelivery && (
                    <>
                      <div className="flex justify-between">
                        <span>CLIENTE:</span>
                        <span className="font-bold">{order.customerName || 'Comensal General'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SERVICIO:</span>
                        <span>Para Llevar / Mostrador</span>
                      </div>
                    </>
                  )}
                  {order.serverName && (
                    <div className="flex justify-between">
                      <span>ATENDIDO POR:</span>
                      <span>{order.serverName}</span>
                    </div>
                  )}
                </div>

                {/* Items breakdown */}
                <div className="space-y-1.5 pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase border-b border-slate-200 pb-0.5">
                    <span>Cant / Descripción</span>
                    <span>Total</span>
                  </div>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-semibold text-xs">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span>{formatCOP(it.totalUnitPrice * it.quantity)}</span>
                      </div>
                      {it.selectedModifiers.length > 0 && (
                        <div className="text-[10px] text-slate-600 pl-3">
                          {it.selectedModifiers.map((m) => m.name).join(', ')}
                        </div>
                      )}
                      {it.notes && (
                        <div className="text-[10px] text-slate-600 italic pl-3">
                          *{it.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>{formatCOP(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-red-600">
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
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-300 text-slate-900">
                    <span>TOTAL A PAGAR:</span>
                    <span>{formatCOP(order.total)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between">
                    <span>FORMA DE PAGO:</span>
                    <span className="font-bold uppercase">
                      {order.paymentMethod === 'contra_entrega' || isDelivery
                        ? 'CONTRA ENTREGA (RECIBE DOMICILIARIO)'
                        : order.paymentMethod === 'cash'
                        ? 'EFECTIVO'
                        : order.paymentMethod === 'card'
                        ? 'DATÁFONO / TARJETA'
                        : 'TRANSFERENCIA QR'}
                    </span>
                  </div>
                  {order.paymentMethod === 'cash' && order.paidAmount && (
                    <>
                      <div className="flex justify-between">
                        <span>PAGA CON:</span>
                        <span>{formatCOP(order.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-700">
                        <span>CAMBIO A LLEVAR:</span>
                        <span>{formatCOP(order.change || 0)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Customer signature / confirmation */}
                {isDelivery && (
                  <div className="pt-3 pb-1 border-b border-dashed border-slate-300 text-center space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Firma de Recibido a Conformidad</p>
                    <div className="w-48 mx-auto border-b border-slate-400"></div>
                    <p className="text-[9px] text-slate-400">C.C. / Nombre de quien recibe</p>
                  </div>
                )}

                {/* Footer message */}
                <div className="text-center text-[10px] text-slate-600 space-y-1 pt-1">
                  <p className="font-bold">{footerMsg}</p>
                  <p className="tracking-widest text-slate-400">|||||||||||||||||||||||||||||</p>
                  <p className="text-[8px] text-slate-500">MAXI POLLOS 22 • Facturación POS</p>
                </div>
              </div>
            )}

            {/* SEPARADOR DE CORTE EN IMPRESIÓN */}
            {isDelivery && activeView === 'both' && (
              <div className="hidden print:block w-full text-center text-xs font-mono font-bold my-4 py-2 border-y-2 border-dashed border-black">
                - - - - - - - - - - - - CORTE DE TIQUETE - - - - - - - - - - - -
              </div>
            )}

            {/* TICKET 2: COPIA CONTROL CAJA Y ARCHIVO ADMINISTRATIVO */}
            {isDelivery && (activeView === 'both' || activeView === 'admin') && (
              <div className="w-full md:max-w-sm bg-white text-slate-900 font-mono text-xs p-5 rounded-2xl shadow-lg border-2 border-slate-300 space-y-3 print:shadow-none print:border-none print:m-0 print:p-2">
                {/* Admin Header */}
                <div className="bg-slate-900 text-white text-center py-1.5 px-2 rounded-lg font-black text-xs uppercase tracking-wider">
                  📋 COPIA CONTROL CAJA / ARCHIVO
                </div>

                <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-300">
                  <div className="text-sm font-black text-slate-900 uppercase">
                    {companyName}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600">
                    SISTEMA DE AUDITORÍA Y CONTROL INTERNO
                  </div>
                  <div className="text-[9px] text-slate-500">
                    NIT: {nit} • Sucursal Principal
                  </div>
                </div>

                {/* Ticket Meta */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between font-black text-slate-900">
                    <span>ORDEN ARCHIVO:</span>
                    <span>ORD-{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FECHA:</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('es-CO')}{' '}
                      {new Date(order.createdAt).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-red-600">
                    <span>TIPO DE SERVICIO:</span>
                    <span>DOMICILIO MOTORIZADO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLIENTE:</span>
                    <span className="font-bold truncate max-w-[150px]">{order.customerName || 'Cliente Domicilio'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIRECCIÓN DESTINO:</span>
                    <span className="font-semibold truncate max-w-[150px]">{order.deliveryAddress || 'Sin dirección'}</span>
                  </div>
                  {order.deliveryPhone && (
                    <div className="flex justify-between">
                      <span>TELÉFONO:</span>
                      <span>{order.deliveryPhone}</span>
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="space-y-1 pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase border-b border-slate-200 pb-0.5">
                    <span>Detalle de Cocina</span>
                    <span>Total</span>
                  </div>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono">{formatCOP(it.totalUnitPrice * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Financial Breakdown */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
                  <div className="flex justify-between">
                    <span>SUBTOTAL VENTA:</span>
                    <span>{formatCOP(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IMPUESTOS (IVA/INC):</span>
                    <span>{formatCOP(order.tax)}</span>
                  </div>
                  {order.tip > 0 && (
                    <div className="flex justify-between">
                      <span>PROPINA:</span>
                      <span>{formatCOP(order.tip)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-300">
                    <span>TOTAL REGISTRADO:</span>
                    <span>{formatCOP(order.total)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>MÉTODO DE PAGO:</span>
                    <span className="font-bold uppercase text-slate-900">
                      {order.paymentMethod === 'contra_entrega' || isDelivery
                        ? 'CONTRA ENTREGA (RECIBE DOMICILIARIO)'
                        : order.paymentMethod === 'cash'
                        ? 'EFECTIVO'
                        : order.paymentMethod === 'card'
                        ? 'DATÁFONO'
                        : 'TRANSFERENCIA'}
                    </span>
                  </div>
                </div>

                {/* Dispatch & Archive Control Boxes */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[10px]">
                  <p className="font-black text-slate-700 uppercase border-b border-slate-200 pb-1">
                    Control de Despacho y Caja:
                  </p>
                  <div className="flex justify-between">
                    <span>Despachado en Cocina:</span>
                    <span className="font-bold">[ OK ]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domiciliario Asignado:</span>
                    <span className="border-b border-slate-400 w-28 inline-block"></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora de Salida:</span>
                    <span className="border-b border-slate-400 w-28 inline-block"></span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Firma Responsable Caja:</span>
                    <span className="border-b border-slate-400 w-28 inline-block"></span>
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-400 pt-1">
                  *** COMPROBANTE NO VÁLIDO PARA DEDUCCIÓN TRIBUTARIA - USO INTERNO ***
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-surface-elevated border-t border-border-subtle flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-surface hover:bg-surface-hover text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-border-subtle flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Printer size={16} />
            <span>{isDelivery ? 'Imprimir Ambos Tiquetes (Domicilio)' : 'Imprimir Tiquete'}</span>
          </button>
          <button
            onClick={() => {
              onNewOrder();
              onClose();
            }}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>
    </div>
  );
};
