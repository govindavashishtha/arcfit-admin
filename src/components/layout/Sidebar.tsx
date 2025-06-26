import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCheck, Building, LayoutDashboard, CreditCard, Calendar, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import SocietySelector from './SocietySelector';

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Members',
      path: '/members',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Trainers',
      path: '/trainers',
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      name: 'Memberships',
      path: '/memberships',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: 'Events',
      path: '/events',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: 'Society',
      path: '/society',
      icon: <Building className="w-5 h-5" />,
    },
  ];

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`
    : 'w-64 bg-blue-800 text-white min-h-screen';

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-600 text-white focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      <div className={sidebarClasses}>
        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-lg">AF</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">ArcFit</h2>
              <p className="text-xs text-blue-200">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-lg">{user?.first_name?.charAt(0) || 'A'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">{user?.first_name} {user?.last_name}</h3>
              <p className="text-xs text-blue-200">{user?.role || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Society Selector */}
        <SocietySelector />

        <nav className="p-5">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;