import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const statusColor: Record<string, string> = {
  PAID: 'text-araucaria-400',
  PENDING: 'text-zinc-400',
  OVERDUE: 'text-red-400',
};

export function PaymentsPage() {
  const { user } = useAuth();

  const { data: payments } = useQuery({
    queryKey: ['payments', 'producer', user?.id],
    queryFn: () => api.get(`/payments/producer/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  });

  const total = payments?.reduce((acc: number, p: any) => acc + p.amount, 0) ?? 0;
  const paid = payments?.filter((p: any) => p.status === 'PAID').reduce((acc: number, p: any) => acc + p.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pagamentos</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Total Recebido</p>
          <p className="text-2xl font-bold text-araucaria-400">R$ {paid.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Total Previsto</p>
          <p className="text-2xl font-bold text-zinc-100">R$ {total.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-left py-3 px-4">Parcela</th>
              <th className="text-left py-3 px-4">Modalidade</th>
              <th className="text-left py-3 px-4">Vencimento</th>
              <th className="text-right py-3 px-4">Valor</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((p: any) => (
              <tr key={p.id} className="border-b border-zinc-800/50">
                <td className="py-3 px-4 font-medium">{p.parcel}</td>
                <td className="py-3 px-4 text-zinc-400">{p.contract?.modality || '—'}</td>
                <td className="py-3 px-4">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="py-3 px-4 text-right font-semibold">R$ {p.amount.toFixed(2)}</td>
                <td className={`py-3 px-4 font-medium ${statusColor[p.status] || ''}`}>{p.status}</td>
              </tr>
            )) ?? []}
          </tbody>
        </table>
      </div>
    </div>
  );
}
