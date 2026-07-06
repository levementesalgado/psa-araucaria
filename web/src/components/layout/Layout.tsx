import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../hooks/useAuth.tsx';

const links = [
  { to: '/', label: 'Início' },
  { to: '/contratos', label: 'Contratos' },
  { to: '/arvores', label: 'Araucárias' },
  { to: '/pagamentos', label: 'Pagamentos' },
  { to: '/perfil', label: 'Perfil' },
];

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800 px-6 py-3 flex items-center gap-6">
        <span className="text-lg font-bold text-araucaria-400">PSA Araucária</span>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}
            className={({ isActive }) => clsx('hover:text-araucaria-400 transition text-sm', isActive && 'text-araucaria-400 font-semibold')}>
            {l.label}
          </NavLink>
        ))}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="text-sm text-zinc-500 hover:text-red-400 transition">
            Sair
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
