import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Code2, 
  Terminal, 
  Trophy, 
  Bot, 
  FileText, 
  BookOpen, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Flame,
  User as UserIcon,
  Compass
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">VERIXA</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block -mt-1">Placement Engine</span>
          </div>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/dashboard') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/company-prep"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/company-prep') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Company Prep</span>
            </Link>

            <Link
              to="/dsa"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/dsa') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>DSA Practice</span>
            </Link>

            <Link
              to="/contests"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/contests') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Contests</span>
            </Link>

            <Link
              to="/ai-interview"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/ai-interview') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Interview</span>
            </Link>

            <Link
              to="/mistakes"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/mistakes') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Mistakes</span>
            </Link>

            <Link
              to="/resume"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/resume') ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume AI</span>
            </Link>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Streak Badge */}
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{user?.currentStreak || 1} Day Streak</span>
              </div>

              {/* Admin Button if Admin */}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* User Dropdown / Logout */}
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                  {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800/60"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-lg shadow-blue-500/25 transition-all"
              >
                Start Preparing
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
