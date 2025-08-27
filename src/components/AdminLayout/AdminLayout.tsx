import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  LayoutDashboardIcon, 
  RadioIcon, 
  UsersIcon, 
  CalendarIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';

export const AdminLayout = (): JSX.Element => {
  const { user, signOut } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboardIcon },
    { name: 'Program Management', href: '/admin/programs', icon: RadioIcon },
    { name: 'Organization', href: '/admin/organization', icon: UsersIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if there's an error
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f4c81] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-[#003dc0]">
          <h1 className="text-white text-xl font-bold">RRI Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0375e5] text-white border-r-4 border-white'
                    : 'text-gray-300 hover:bg-[#0375e5] hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-[#003dc0] rounded-lg p-4">
            <div className="text-white text-sm mb-2">
              Welcome, {user?.full_name || user?.username}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-300 hover:text-white text-sm transition-colors"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <img
                src="/rri-jambi-2023--1--1-1.png"
                alt="RRI Jambi"
                className="h-8 w-auto"
              />
              <span className="text-gray-900 font-medium">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};