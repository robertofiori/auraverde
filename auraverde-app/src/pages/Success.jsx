import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Success() {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentMethod, orderId: stateOrderId } = location.state || {};
    
    // Fallback order ID if not passed in state
    const orderId = stateOrderId || `ORD-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6 text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                    {paymentMethod === 'bank_transfer' ? 'receipt_long' : 'check_circle'}
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {paymentMethod === 'bank_transfer' ? '¡Pedido Recibido!' : '¡Gracias por su compra!'}
            </h1>

            <div className="max-w-md mb-8">
                <p className="text-lg text-slate-500 dark:text-gray-400 mb-2">
                    Su orden <span className="font-bold text-slate-900 dark:text-white">{orderId}</span> ha sido registrada.
                </p>
                
                {paymentMethod === 'bank_transfer' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 mt-6 text-left animate-fade-in-up">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">info</span>
                            Pasos finales para tu pedido:
                        </p>
                        <ol className="text-sm text-emerald-700 dark:text-emerald-500 space-y-3">
                            <li className="flex gap-3">
                                <span className="font-bold bg-emerald-100 dark:bg-emerald-800 size-5 rounded-full flex items-center justify-center shrink-0">1</span>
                                Realiza la transferencia al alias: <strong className="text-slate-900 dark:text-white">farenheit.com.mp</strong>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold bg-emerald-100 dark:bg-emerald-800 size-5 rounded-full flex items-center justify-center shrink-0">2</span>
                                Envía el comprobante por WhatsApp mencionando tu número de orden.
                            </li>
                        </ol>
                        <a 
                            href={`https://wa.me/5492915730038?text=Hola!%20Envío%20comprobante%20del%20pedido%20${orderId}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            Enviar Comprobante
                        </a>
                    </div>
                )}
            </div>

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
