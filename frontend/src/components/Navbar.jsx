import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserPlus, 
  CreditCard, 
  Building, 
  FileText,
  Menu,
  X,
  Settings,
  User,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/admissions', label: 'Admissions', icon: UserPlus },
    { path: '/fees', label: 'Fees', icon: CreditCard },
    { path: '/hostel', label: 'Hostel', icon: Building },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="erp-container" style={{ maxWidth: '100%', padding: '0.75rem 2rem' }}>
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ERP System
              </h1>
              <p className="text-xs text-muted text-slate-400">Education Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive(path)
                    ? 'active'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <Bell size={20} className="text-slate-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">3</span>
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-slate-700" />
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-link flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(path)
                      ? 'active bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;