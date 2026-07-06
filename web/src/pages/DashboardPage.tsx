import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth.tsx';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();

  const { data: contracts } = useQuery({
    queryKey: ['contracts', 'active'],
    queryFn: () => api.get('/contracts/active').then(r => r.data),
  });

  const { data: payments } = useQuery({
    queryKey: ['payments', 'upcoming'],
    queryFn: () => api.get(`/payments/upcoming/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  });

  const totalTrees = contracts?.reduce((acc: number, c: any) => acc + (c.trees?.length || 0), 0) ?? 0;
  const upcoming = payments?.filter((p: any) => p.status !== 'PAID') ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Olá, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/contratos" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-araucaria-600 transition">
          <p className="text-zinc-400 text-sm">Contratos Ativos</p>
          <p className="text-3xl font-bold text-araucaria-400">{contracts?.length ?? '—'}</p>
        </Link>
        <Link to="/arvores" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-araucaria-600 transition">
          <p className="text-zinc-400 text-sm">Árvores Registradas</p>
          <p className="text-3xl font-bold text-araucaria-400">{totalTrees}</p>
        </Link>
        <Link to="/pagamentos" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-araucaria-600 transition">
          <p className="text-zinc-400 text-sm">Pagamentos Pendentes</p>
          <p className="text-3xl font-bold text-araucaria-400">{upcoming.length}</p>
        </Link>
      </div>

      {upcoming.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Próximos Pagamentos</h2>
          <div className="space-y-2">
            {upcoming.slice(0, 5).map((p: any) => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.parcel}</p>
                  <p className="text-sm text-zinc-400">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`font-bold ${p.status === 'OVERDUE' ? 'text-red-400' : 'text-araucaria-400'}`}>
                  R$ {p.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-4">
        <Link to="/arvores/nova" className="px-6 py-3 bg-araucaria-600 hover:bg-araucaria-500 rounded-lg font-semibold transition inline-block">
          + Nova Árvore
        </Link>
        <Link to="/contratos" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition inline-block">
          Ver Contratos
        </Link>
      </div>
    </div>
  );
}
