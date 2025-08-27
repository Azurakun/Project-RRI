import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

export class AdminAuthService {
  private static instance: AdminAuthService;
  private currentUser: AdminUser | null = null;

  private constructor() {
    // Load user from localStorage on initialization
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  public async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      // For demo purposes, we'll use simple credential check
      // In production, this should use proper password hashing
      if (username === 'ADMIN' && password === 'ADMINRRI22') {
        const user: AdminUser = {
          id: 'admin-001',
          username: 'ADMIN',
          full_name: 'Administrator RRI Jambi',
          role: 'admin'
        };

        this.currentUser = user;
        localStorage.setItem('admin_user', JSON.stringify(user));
        
        // Also set Supabase session for consistency
        await supabase.auth.signInWithPassword({
          email: 'admin@rrijambi.com',
          password: 'admin123'
        });

        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('admin_user');
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase logout error:', error);
    }
    // Force page reload to ensure clean state
    window.location.href = '/';
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}

export const adminAuth = AdminAuthService.getInstance();