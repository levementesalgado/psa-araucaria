import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch { setError('Email ou senha inválidos'); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-araucaria-400">PSA Araucária</h1>
        {error && <div className="bg-red-900/50 border border-red-700 rounded p-3 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-100" />
        </div>
        <button type="submit" className="w-full py-2 bg-araucaria-600 hover:bg-araucaria-500 rounded font-semibold transition">
          Entrar
        </button>
        <p className="text-center text-sm text-zinc-500">
          Não tem conta? <Link to="/cadastro" className="text-araucaria-400 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
