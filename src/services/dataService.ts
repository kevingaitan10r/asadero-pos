import { MenuItem, CategoryId } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_MENU_ITEMS } from '../data/mockData';

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
  }
};
