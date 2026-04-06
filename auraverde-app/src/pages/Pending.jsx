import { useNavigate, useLocation } from 'react-router-dom';

export default function Pending() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6 text-center">
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="material-symbols-outlined text-5xl text-amber-600 dark:text-amber-400">
                    pending
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                El pago está pendiente
            </h1>

            <div className="max-w-md mb-8">
                <p className="text-lg text-slate-500 dark:text-gray-400">
                    Mercado Pago está procesando tu pago. Te avisaremos por email una vez que se haya completado.
                </p>
                <p className="mt-4 text-sm text-slate-400 dark:text-slate-500 italic">
                    Si pagaste con efectivo (Rapipago/Pago Fácil), esto puede demorar hasta 24hs hábiles.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all font-inter"
                >
                    Ver Mis Pedidos
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex-1 py-4 bg-white dark:bg-surface-dark border-2 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-inter"
                >
                    Ir al Inicio
                </button>
            </div>
        </div>
    );
}
