import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', cpfCnpj: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch { setError('Erro ao cadastrar'); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-araucaria-400">Criar Conta</h1>
        {error && <div className="bg-red-900/50 border border-red-700 rounded p-3 text-sm">{error}</div>}
        {(['name', 'email', 'password', 'cpfCnpj'] as const).map(f => (
          <div key={f}>
            <label className="block text-sm text-zinc-400 mb-1 capitalize">{f === 'cpfCnpj' ? 'CPF/CNPJ' : f}</label>
            <input type={f === 'password' ? 'password' : 'text'} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
          </div>
        ))}
        <button type="submit" className="w-full py-2 bg-araucaria-600 hover:bg-araucaria-500 rounded font-semibold transition">
          Cadastrar
        </button>
        <p className="text-center text-sm text-zinc-500">
          Já tem conta? <Link to="/login" className="text-araucaria-400 hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
