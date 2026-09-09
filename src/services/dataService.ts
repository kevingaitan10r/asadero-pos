import { MenuItem, CategoryId, Order, OrderStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/mockData';

export const dataService = {
  // Cargar platos del menú desde la base de datos Supabase
  async getMenuItems(): Promise<MenuItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_active', true)
          .order('plu', { ascending: true });

        if (error) {
          console.warn('Error al cargar platos de Supabase:', error.message);
          return INITIAL_MENU_ITEMS;
        }

        if (data && data.length > 0) {
          // Mapear los datos de Supabase a los tipos de la app
          return data.map((row) => ({
            id: row.id,
            plu: row.plu || '',
            name: row.name,
            description: row.description || '',
            price: Number(row.price),
            categoryId: row.category_id as CategoryId,
            prepTime: row.prep_time || '10m',
            image: row.image_url || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
            isPopular: Boolean(row.is_popular),
            availableModifiers: []
          }));
        }
      } catch (err) {
        console.warn('Error de conexión con Supabase:', err);
      }
    }

    // Fallback a los datos iniciales
    return INITIAL_MENU_ITEMS;
  },

  // Suscripción en Tiempo Real para cambios de precios o platos desde Supabase
  subscribeToMenuChanges(onUpdate: (items: MenuItem[]) => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel('realtime_menu')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        async () => {
          const updatedItems = await dataService.getMenuItems();
          onUpdate(updatedItems);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Guardar nueva comanda / orden en Supabase (o fallback local)
  async saveOrder(order: Order): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const orderTypeDb = order.type === 'dine-in' ? 'dine_in' : order.type;
        const statusDb = order.status === 'completed' ? 'paid' : order.status;

        const { data: createdOrder, error } = await supabase
          .from('orders')
          .insert({
            order_number: `#${order.orderNumber}`,
            order_type: orderTypeDb,
            status: statusDb,
            server_name: order.serverName || 'Mesero',
            customer_name: order.customerName || order.tableName || 'Mesa General',
            delivery_address: order.deliveryAddress,
            delivery_phone: order.deliveryPhone,
            delivery_notes: order.deliveryNotes,
            subtotal: order.subtotal,
            tax_amount: order.tax,
            discount_amount: order.discount,
            total_amount: order.total,
            payment_method: order.paymentMethod,
            paid_amount: order.paidAmount,
            change_amount: order.change
          })
          .select()
          .single();

        if (error) {
          console.warn('Error al guardar comanda en Supabase:', error.message);
          return false;
        }

        if (createdOrder && order.items.length > 0) {
          const itemsPayload = order.items.map((it) => ({
            order_id: createdOrder.id,
            menu_item_id: it.menuItemId.startsWith('item-') ? null : it.menuItemId,
            item_name: it.name,
            quantity: it.quantity,
            unit_price: it.totalUnitPrice,
            total_price: it.totalUnitPrice * it.quantity,
            selected_modifiers: it.selectedModifiers,
            notes: it.notes
          }));

          await supabase.from('order_items').insert(itemsPayload);
        }

        return true;
      } catch (err) {
        console.warn('Excepción guardando orden en Supabase:', err);
      }
    }
    return true;
  },

  // Actualizar estado de comanda (ej. de pending a paid al cobrar en Caja)
  async updateOrderStatus(orderNumber: number | string, status: OrderStatus, paymentData?: Partial<Order>): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const orderNumStr = typeof orderNumber === 'number' ? `#${orderNumber}` : orderNumber;
        const statusDb = status === 'completed' ? 'paid' : status;

        const updatePayload: Record<string, any> = {
          status: statusDb,
          updated_at: new Date().toISOString()
        };

        if (paymentData?.paymentMethod) updatePayload.payment_method = paymentData.paymentMethod;
        if (paymentData?.paidAmount) updatePayload.paid_amount = paymentData.paidAmount;
        if (paymentData?.change) updatePayload.change_amount = paymentData.change;

        const { error } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('order_number', orderNumStr);

        if (error) {
          console.warn('Error actualizando comanda en Supabase:', error.message);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Excepción actualizando orden:', err);
      }
    }
    return true;
  },

  // Suscripción en Tiempo Real para sincronizar comandas entre teléfonos y la Caja PC
  subscribeToOrderChanges(onOrderChange: () => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          onOrderChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

