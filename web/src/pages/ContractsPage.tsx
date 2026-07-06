import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const modalityLabels: Record<string, string> = {
  CONSERVACAO: 'Conservação',
  PLANTIO_LIVRE: 'Plantio Livre',
  APP: 'APP',
  POMAR: 'Pomar',
};

export function ContractsPage() {
  const { user } = useAuth();

  const { data: contracts } = useQuery({
    queryKey: ['contracts', 'producer', user?.id],
    queryFn: () => api.get(`/contracts/producer/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Contratos</h1>

      {(!contracts || contracts.length === 0) ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">Nenhum contrato encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((c: any) => (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{modalityLabels[c.modality] || c.modality}</h2>
                  <p className="text-sm text-zinc-400">{c.producer?.name}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  c.status === 'ACTIVE' ? 'bg-araucaria-900 text-araucaria-300' :
                  c.status === 'FINISHED' ? 'bg-blue-900 text-blue-300' :
                  c.status === 'DRAFT' ? 'bg-zinc-800 text-zinc-400' :
                  'bg-red-900 text-red-300'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Árvores</p>
                  <p className="font-semibold">{c.trees?.length || 0}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Pagamentos</p>
                  <p className="font-semibold">{c.payments?.length || 0}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Total Previsto</p>
                  <p className="font-semibold text-araucaria-400">
                    R$ {c.totalPaymentExpected?.toFixed(2) ?? '—'}
                  </p>
                </div>
              </div>

              {c.payments && c.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-2">Parcelas</p>
                  <div className="space-y-1">
                    {c.payments.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-sm py-1">
                        <span>{p.parcel}</span>
                        <span className={p.status === 'PAID' ? 'text-araucaria-400' : p.status === 'OVERDUE' ? 'text-red-400' : 'text-zinc-400'}>
                          R$ {p.amount.toFixed(2)} — {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
