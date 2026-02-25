import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signin } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signin(email, password);
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setError('Error al iniciar sesión: Verifique sus credenciales.');
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <h2 className="text-3xl font-varela text-primary mb-2 text-center">Bienvenido</h2>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Ingresa a tu cuenta para continuar</p>

                {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:text-white"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-primary hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-200/50 dark:shadow-none disabled:opacity-50"
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    ¿No tienes una cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Regístrate</Link>
                </div>
            </div>
        </div>
    );
}
