
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald flex items-center justify-center p-8 font-sans">
      <div className="glass p-12 md:p-16 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-lg border border-white/5 animate-reveal text-center">
        <div className="mb-12 space-y-4">
          <div className="h-20 w-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-serif text-white tracking-tight">Escritorio Autor</h2>
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-black">Acceso a Archivo Restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gold/60 ml-2">Email</label>
            <input
              type="email"
              className="w-full px-6 py-4 glass rounded-2xl border border-white/5 focus:border-gold outline-none transition-all text-white placeholder:text-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="autor@lumina.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gold/60 ml-2">Contraseña</label>
            <input
              type="password"
              className="w-full px-6 py-4 glass rounded-2xl border border-white/5 focus:border-gold outline-none transition-all text-white placeholder:text-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2 bg-red-500/10 p-3 rounded-lg text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-emerald py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Validar Identidad'}
          </button>
        </form>

        <p className="mt-12 text-[10px] text-white/10 uppercase tracking-widest font-medium italic">
          Lumina Editorial • Seguridad de Archivo
        </p>
      </div>
    </div>
  );
};

export default Login;
