import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCheck, Building, LayoutDashboard, CreditCard, Calendar, FileText, Tag, Menu, X, LogOut, Upload } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import SocietySelector from './SocietySelector';

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isCenterAdmin = user?.role === 'center_admin';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const allNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
    {
      name: 'Members',
      path: '/members',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'super_admin', 'center_admin'], // Available for center admins
    },
    {
      name: 'Bulk Members',
      path: '/bulk-members',
      icon: <Upload className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
    {
      name: 'Trainers',
      path: '/trainers',
      icon: <UserCheck className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
    {
      name: 'Memberships',
      path: '/memberships',
      icon: <CreditCard className="w-5 h-5" />,
      roles: ['admin', 'super_admin', 'center_admin'], // Available for center admins
    },
    {
      name: 'Events',
      path: '/events',
      icon: <Calendar className="w-5 h-5" />,
      roles: ['admin', 'super_admin', 'center_admin'], // Available for center admins
    },
    {
      name: 'Diet Plans',
      path: '/diet-plans',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
    {
      name: 'Subscription Plans',
      path: '/subscription-plans',
      icon: <Tag className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
    {
      name: 'Center',
      path: '/center',
      icon: <Building className="w-5 h-5" />,
      roles: ['admin', 'super_admin'], // Only for admins
    },
  ];
  
  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    item.roles.includes(user?.role || 'admin')
  );

  // Different colors for society admin
  // Different colors for center admin
  const sidebarBgColor = isCenterAdmin ? 'bg-emerald-800' : 'bg-blue-800';
  const borderColor = isCenterAdmin ? 'border-emerald-700' : 'border-blue-700';
  const buttonBgColor = isCenterAdmin ? 'bg-emerald-600' : 'bg-blue-600';
  const textColor = isCenterAdmin ? 'text-emerald-200' : 'text-blue-200';
  const hoverBgColor = isCenterAdmin ? 'hover:bg-emerald-700' : 'hover:bg-blue-700';
  const activeBgColor = isCenterAdmin ? 'bg-emerald-700' : 'bg-blue-700';
  const selectBgColor = isCenterAdmin ? 'bg-emerald-700' : 'bg-blue-700';
  const selectBorderColor = isCenterAdmin ? 'border-emerald-600' : 'border-blue-600';
  const selectTextColor = isCenterAdmin ? 'text-emerald-300' : 'text-blue-300';

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-30 w-64 ${sidebarBgColor} text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`
    : `w-64 ${sidebarBgColor} text-white min-h-screen`;

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-40 p-2 rounded-md ${buttonBgColor} text-white focus:outline-none`}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      <div className={sidebarClasses}>
        <div className={`p-5 border-b ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${buttonBgColor} flex items-center justify-center`}>
              <span className="font-bold text-lg">AF</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">ArcFit</h2>
              <p className={`text-xs ${textColor}`}>
                {isCenterAdmin ? 'Center Dashboard' : 'Admin Dashboard'}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-5 border-b ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${buttonBgColor} flex items-center justify-center`}>
              <span className="font-bold text-lg">{user?.first_name?.charAt(0) || 'A'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">{user?.first_name} {user?.last_name}</h3>
              <p className={`text-xs ${textColor}`}>
                {user?.role === 'center_admin' ? 'Center Admin' : user?.role || 'Admin'}
              </p>
            </div>
          </div>
        </div>

        {/* Society Selector */}
        {!isCenterAdmin && <SocietySelector />}

        <nav className="p-5">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      isActive
                        ? `${activeBgColor} text-white`
                        : `text-${isCenterAdmin ? 'emerald' : 'blue'}-100 ${hoverBgColor} hover:text-white`
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