import { useNavigate, useLocation } from 'react-router-dom';

export default function Failure() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6 text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 animate-shake">
                <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">
                    error
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                ¡Ups! El pago falló
            </h1>

            <div className="max-w-md mb-8">
                <p className="text-lg text-slate-500 dark:text-gray-400 mb-6">
                    No pudimos procesar tu pago a través de Mercado Pago. No te preocupes, no se ha realizado ningún cargo.
                </p>
                
                <div className="bg-slate-50 dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-gray-800 text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Puedes intentar lo siguiente:</p>
                    <ul className="text-sm text-slate-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                        <li>Verifica que tu tarjeta tenga fondos suficientes.</li>
                        <li>Intenta con otro medio de pago.</li>
                        <li>Prueba realizar el pago nuevamente.</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={() => navigate('/checkout')}
                    className="flex-1 py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all font-inter"
                >
                    Reintentar Pago
                </button>
                <button
                    onClick={() => navigate('/cart')}
                    className="flex-1 py-4 bg-white dark:bg-surface-dark border-2 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-inter"
                >
                    Volver al Carrito
                </button>
            </div>
        </div>
    );
}
