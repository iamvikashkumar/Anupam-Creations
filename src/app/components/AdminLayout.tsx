import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/auth/AuthProvider';

const navigation = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-paper-dim bg-paper/95 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/admin" className="font-display text-xl font-bold text-maroon">
            Anupam Creations
          </Link>
          <div className="flex items-center gap-3 text-right">
            <span className="hidden text-xs text-ink/55 sm:block">{user?.email}</span>
            <button type="button" onClick={handleLogout} className="btn-secondary px-3 py-2 text-sm">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-paper-dim px-4 py-6 md:block">
          <nav className="space-y-1" aria-label="Admin navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-card px-4 py-3 text-sm font-semibold ${
                    isActive ? 'bg-maroon text-white' : 'text-ink/70 hover:bg-maroon/10 hover:text-maroon'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 pb-24 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-paper-dim bg-paper px-2 py-2 md:hidden"
        aria-label="Admin navigation"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `min-h-touch px-1 py-2 text-center text-xs font-semibold ${
                isActive ? 'text-maroon' : 'text-ink/55'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}