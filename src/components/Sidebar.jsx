import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiCheckSquare, FiHome, FiUsers, FiDollarSign, FiSettings, FiLogOut, FiMenu, FiX, FiShield, FiStar, FiSend, FiPlusSquare } from 'react-icons/fi';
import { useState } from 'react';
import { useAdminAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Pending Approvals', path: '/pending', icon: FiCheckSquare },
  { name: 'All Properties', path: '/properties', icon: FiHome },
  { name: 'Add Property', path: '/add-property', icon: FiPlusSquare },
  { name: 'Users', path: '/users', icon: FiUsers },
  { name: 'Transactions', path: '/transactions', icon: FiDollarSign },
  { name: 'Testimonials', path: '/testimonials', icon: FiStar },
  { name: 'Newsletter', path: '/newsletter', icon: FiSend },
  { name: 'Settings', path: '/settings', icon: FiSettings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-navy-800">
        <Link to="/dashboard" className="flex items-center gap-2 no-underline">
          <img src="/DIRECTKEYLOGO.png" alt="DirectKey" className="h-9 w-auto" />
          <span className="text-lg font-bold text-white">
            Direct<span className="text-primary-400">Key</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 mt-2">
          <FiShield className="text-primary-400 text-xs" />
          <p className="text-xs text-primary-400 font-medium">Admin Panel</p>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-400/20 rounded-full flex items-center justify-center">
            <FiShield className="text-primary-400" />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">{admin?.full_name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                isActive ? 'bg-primary-400 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <item.icon className="text-lg" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all bg-transparent border-0 cursor-pointer"
        >
          <FiLogOut className="text-lg" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center text-white border-0 cursor-pointer shadow-lg"
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-navy-950 z-40 transform transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Content />
      </aside>
    </>
  );
};

export default Sidebar;
