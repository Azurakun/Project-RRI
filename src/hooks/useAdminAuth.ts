import { useState, useEffect } from 'react';
import { adminAuth, AdminUser } from '../lib/adminAuth';

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = adminAuth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    const result = await adminAuth.login(username, password);
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await adminAuth.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: adminAuth.isAuthenticated(),
  };
};