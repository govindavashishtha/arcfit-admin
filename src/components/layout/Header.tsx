import React from 'react';
import { LogOut, Bell, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome, {user?.first_name || 'Admin'}</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;