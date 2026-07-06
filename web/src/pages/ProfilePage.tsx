import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (user) {
      api.get(`/producers/${user.id}`).then(r => {
        setForm({ name: r.data.name, phone: r.data.phone || '', address: r.data.address || '' });
      }).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/producers/${user?.id}`, form);
    alert('Perfil atualizado!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input value={user?.email || ''} disabled className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-4 py-2 text-zinc-500" />
        </div>
        {(['name', 'phone', 'address'] as const).map(f => (
          <div key={f}>
            <label className="block text-sm text-zinc-400 mb-1 capitalize">{f}</label>
            <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
          </div>
        ))}
        <button type="submit" className="w-full py-2 bg-araucaria-600 hover:bg-araucaria-500 rounded font-semibold transition">
          Salvar
        </button>
      </form>

      <button onClick={handleLogout} className="w-full py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-800 rounded font-semibold text-red-400 transition">
        Sair
      </button>
    </div>
  );
}
