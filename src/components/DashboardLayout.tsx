import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Settings, 
  LogOut, 
  Zap, 
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Search', href: '/app/search', icon: Search },
    { label: 'Leads', href: '/app/leads', icon: Users },
    { label: 'Settings', href: '/app/profile', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white hidden lg:block uppercase">LeadForge AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 lg:px-2">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full border border-slate-700 shadow-sm" />
            ) : (
              <div className="w-8 h-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                {profile?.displayName?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{profile?.displayName}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate uppercase">{profile?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center lg:gap-3 justify-center lg:justify-start px-2 lg:px-4 py-2.5 text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Navbar */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40 shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600 w-5 h-5 fill-current" />
            <span className="font-bold tracking-tight text-slate-900 uppercase text-sm">LeadForge</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <LayoutDashboard className="w-6 h-6" /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-slate-600"></div><div className="w-4 h-0.5 bg-slate-600 ml-auto"></div><div className="w-6 h-0.5 bg-slate-600"></div></div>}
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
              {navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Alpha v1.0.4</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">LF</div>
            </div>
            <Link 
              to="/app/search"
              className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 uppercase tracking-widest"
            >
              Forage Leads
            </Link>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-auto p-4 md:p-10 pb-24 md:pb-10 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Side Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-0 right-0 bottom-0 w-3/4 bg-white z-[60] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="font-bold uppercase tracking-widest text-slate-900">Account</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{profile?.displayName}</p>
                      <p className="text-xs text-slate-500">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-2 pt-8 border-t border-slate-100">
                    <Link to="/app/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-50 font-bold text-slate-900 text-sm">
                      <Settings className="w-5 h-5 text-indigo-600" /> Settings
                    </Link>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                      className="flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 font-bold text-red-600 text-sm"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
