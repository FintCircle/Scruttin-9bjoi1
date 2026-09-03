import { Link, useLocation } from 'react-router-dom';
import { BookMarked, Compass, HelpCircle, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/tagged', icon: BookMarked, label: 'Tagged' },
  { path: '/discover', icon: Compass, label: 'Discover' },
  { path: '/qa', icon: HelpCircle, label: 'Q&A' },
  { path: '/create', icon: PlusCircle, label: 'Create' },
  { path: '/profile/derrick', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[hsl(222,47%,9%)] z-40 px-4 py-6">
        <Link to="/discover" className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 bg-[hsl(24,95%,53%)] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">Scruttin</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path === '/profile/derrick' ? '/profile' : path + '/');
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[hsl(24,95%,53%)] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <Link to="/profile/derrick" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
              alt="Derrick"
              className="w-8 h-8 rounded-full object-cover border-2 border-[hsl(24,95%,53%)]"
            />
            <div>
              <p className="text-white text-sm font-semibold">Derrick Osei</p>
              <p className="text-slate-500 text-xs">@derrick</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[hsl(222,47%,9%)] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link to="/discover" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[hsl(24,95%,53%)] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Scruttin</span>
        </Link>
        <Link to="/profile/derrick">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-[hsl(24,95%,53%)]"
          />
        </Link>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[hsl(222,47%,9%)] border-t border-white/10 flex">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path === '/profile/derrick' ? '/profile' : path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors min-h-[56px]',
                isActive
                  ? 'text-[hsl(24,95%,53%)]'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
