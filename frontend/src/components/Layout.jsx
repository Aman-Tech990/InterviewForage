import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard, LogOut, Menu, MessagesSquare, Mic, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interviews', label: 'Interviews', icon: Mic },
  { to: '/code-review', label: 'Code review', icon: Code2 },
  { to: '/experiences', label: 'Experiences', icon: MessagesSquare },
];

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5 text-[15px] font-semibold tracking-tight">
        Interview Forage
      </div>
      <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-raised text-ink' : 'text-muted hover:bg-raised/60 hover:text-ink'}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <p className="truncate text-xs text-muted">{user?.email}</p>
        <button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-full">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-panel lg:block"><Sidebar /></aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative h-full w-64 animate-rise border-r border-line bg-panel"><Sidebar onNavigate={() => setOpen(false)} /></aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden">
          <button onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} className="rounded p-1 text-muted hover:text-ink">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-semibold">Interview Forage</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div key={location.pathname} className="page mx-auto max-w-5xl px-5 py-8 sm:px-8"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
