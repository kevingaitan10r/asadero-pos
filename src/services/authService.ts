import { AuthUser } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'maxi_pollos_current_user';

// Default mock users when Supabase is not yet configured with real API keys
const DEFAULT_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@maxipollos.com',
    fullName: 'Administrador General',
    role: 'admin',
    phone: '3001234567',
    password: 'admin123'
  },
  {
    id: 'user-carlos',
    username: 'carlos',
    email: 'carlos@maxipollos.com',
    fullName: 'Carlos Ramírez',
    role: 'mesero',
    phone: '3123456789',
    password: 'mesero123'
  },
  {
    id: 'user-laura',
    username: 'laura',
    email: 'laura@maxipollos.com',
    fullName: 'Laura Castro',
    role: 'mesero',
    phone: '3142223344',
    password: 'mesero123'
  },
  {
    id: 'user-caja',
    username: 'caja',
    email: 'caja@maxipollos.com',
    fullName: 'Caja Principal (PC)',
    role: 'cajero',
    phone: '3000000000',
    password: 'caja123'
  }
];

export const authService = {
  // Get currently logged-in user from storage
  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore JSON parse errors
    }
    return null;
  },

  // Login by Email OR Username and Password
  async login(identifier: string, password: string): Promise<{ user: AuthUser | null; error?: string }> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { user: null, error: 'Ingresa tu usuario/correo y contraseña.' };
    }

    // 1. If Supabase is connected with valid keys, query remote profiles table
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${cleanId},email.ilike.${cleanId}`)
          .eq('password_hash', cleanPass)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.warn('Error Supabase profiles:', error.message);
        }

        if (data) {
          const authUser: AuthUser = {
            id: data.id,
            username: data.username,
            email: data.email || `${data.username}@maxipollos.com`,
            fullName: data.full_name,
            role: data.role as AuthUser['role'],
            phone: data.phone
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          return { user: authUser };
        }
      } catch (err) {
        console.warn('Supabase query error, fallback to local accounts:', err);
      }
    }

    // 2. Fallback to default accounts (works offline and for instant testing)
    const match = DEFAULT_USERS.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    if (match) {
      const authUser: AuthUser = {
        id: match.id,
        username: match.username,
        email: match.email,
        fullName: match.fullName,
        role: match.role,
        phone: match.phone
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { user: authUser };
    }

    return {
      user: null,
      error: 'Usuario o contraseña incorrectos. Verifica tus datos.'
    };
  },

  // Logout
  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (isSupabaseConfigured && supabase) {
        supabase.auth.signOut().catch(() => {});
      }
    } catch {
      // Ignore storage errors
    }
  },

  // Quick Demo Logins for fast phone testing
  getDemoUsers() {
    return DEFAULT_USERS.map(({ password: _, ...user }) => user);
  }
};

