import { AdminUser } from './db';

const API_BASE_URL = 'http://localhost:3001/api';

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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Login failed' };
      }

      const data = await response.json();
      this.currentUser = data.user;
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      return { success: true, user: data.user };

    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('admin_user');
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