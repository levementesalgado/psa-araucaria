import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth.tsx';
import { useQuery } from '@tanstack/react-query';

export function NewTreePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ contractId: '', latitude: '', longitude: '', plantedDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: contracts } = useQuery({
    queryKey: ['contracts', 'producer', user?.id],
    queryFn: () => api.get(`/contracts/producer/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/trees', {
        contractId: form.contractId,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        plantedDate: form.plantedDate || undefined,
      });
      navigate('/arvores');
    } finally { setSubmitting(false); }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }));
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nova Araucária</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Contrato</label>
          <select value={form.contractId} onChange={e => setForm({ ...form, contractId: e.target.value })} required
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100">
            <option value="">Selecione...</option>
            {contracts?.filter((c: any) => c.status === 'ACTIVE').map((c: any) => (
              <option key={c.id} value={c.id}>{c.modality} — {c.producer?.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} required
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} required
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
          </div>
        </div>
        <button type="button" onClick={getLocation} className="text-sm text-araucaria-400 hover:underline">
          Usar localização atual
        </button>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Data de Plantio</label>
          <input type="date" value={form.plantedDate} onChange={e => setForm({ ...form, plantedDate: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-araucaria-600 hover:bg-araucaria-500 rounded-lg font-semibold transition disabled:opacity-50">
          {submitting ? 'Salvando...' : 'Registrar Árvore'}
        </button>
      </form>
    </div>
  );
}
