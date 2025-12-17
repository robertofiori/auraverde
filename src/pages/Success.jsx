import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Success() {
    const navigate = useNavigate();
    // In a real app, clearCart would be called after successful payment
    // const { clearCart } = useCart(); 

    // Generate a random order ID
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6 text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">check_circle</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                ¡Gracias por su compra!
            </h1>

            <p className="text-lg text-slate-500 dark:text-gray-400 mb-8 max-w-md">
                Su orden <span className="font-bold text-slate-900 dark:text-white">{orderId}</span> ha sido confirmada y será enviada pronto.
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={() => navigate('/catalog')}
                    className="flex-1 py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all"
                >
                    Continuar Comprando
                </button>
                <button
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-4 bg-white dark:bg-surface-dark border-2 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                    Ver Orden
                </button>
            </div>
        </div>
    );
}
