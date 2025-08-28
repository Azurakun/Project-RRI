import pool from './mysql';
import { AdminUser } from './db';

// In a real application, use a library like bcrypt to handle password hashing
const FAKE_PASSWORD_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

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
      // For demo purposes, we'll use a simple credential check
      if (username === 'ADMIN' && password === 'ADMINRRI22') {
        const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
        const users = rows as AdminUser[];

        if (users.length > 0) {
          const user = users[0];
          // In a real app, you would compare the hashed password
          this.currentUser = user;
          localStorage.setItem('admin_user', JSON.stringify(user));
          return { success: true, user };
        }
      }
      return { success: false, error: 'Invalid username or password' };
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