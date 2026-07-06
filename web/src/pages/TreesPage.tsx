import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export function TreesPage() {
  const { user } = useAuth();

  const { data: contracts } = useQuery({
    queryKey: ['contracts', 'producer', user?.id],
    queryFn: () => api.get(`/contracts/producer/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  });

  const allTrees = contracts?.flatMap((c: any) =>
    (c.trees || []).map((t: any) => ({ ...t, contractModality: c.modality, contractId: c.id }))
  ) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Araucárias</h1>
        <Link to="/arvores/nova" className="px-4 py-2 bg-araucaria-600 hover:bg-araucaria-500 rounded font-semibold transition">
          + Nova
        </Link>
      </div>

      {allTrees.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg mb-4">Nenhuma árvore registrada ainda.</p>
          <Link to="/arvores/nova" className="text-araucaria-400 hover:underline">Registrar primeira árvore</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="text-left py-3 px-4">Contrato</th>
                <th className="text-left py-3 px-4">Latitude</th>
                <th className="text-left py-3 px-4">Longitude</th>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Foto</th>
              </tr>
            </thead>
            <tbody>
              {allTrees.map((t: any) => (
                <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                  <td className="py-3 px-4">{t.contractModality}</td>
                  <td className="py-3 px-4 font-mono text-xs">{t.latitude.toFixed(5)}</td>
                  <td className="py-3 px-4 font-mono text-xs">{t.longitude.toFixed(5)}</td>
                  <td className="py-3 px-4">{t.plantedDate ? new Date(t.plantedDate).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${t.isVerified ? 'bg-araucaria-900 text-araucaria-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {t.isVerified ? 'Verificada' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.photoUrl ? (
                      <a href={t.photoUrl} target="_blank" className="text-araucaria-400 hover:underline">Ver</a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
