import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, total, subtotal, tax } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/success');
        }, 2000);
    };

    if (cartItems.length === 0) {
        navigate('/catalog');
        return null;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-12">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-4 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 border-b border-gray-100 dark:border-gray-800 mb-6">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-surface-dark transition-colors"
                >
                    <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pagar</h1>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col: Forms */}
                <div className="flex flex-col gap-6">
                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            Dirección de Envío
                        </h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="Nombre" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                                <input required type="text" placeholder="Apellido" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            </div>
                            <input required type="text" placeholder="Dirección" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="Ciudad" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                                <input required type="text" placeholder="Código Postal" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            </div>
                        </form>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">credit_card</span>
                            Método de Pago
                        </h2>
                        <div className="flex flex-col gap-4">
                            <input required form="checkout-form" type="text" placeholder="Número de Tarjeta" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required form="checkout-form" type="text" placeholder="MM/YY" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                                <input required form="checkout-form" type="text" placeholder="CVV" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Order Summary */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resumen del Pedido</h2>
                        <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="size-16 bg-gray-100 rounded-lg bg-center bg-cover shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-gray-400">Cant: {item.quantity}</p>
                                        <p className="font-bold text-primary text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-white/10 my-4"></div>

                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                <span>Impuestos (7%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                <span>Envío</span>
                                <span className="text-green-500 font-bold">Gratis</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            disabled={isProcessing}
                            className="w-full mt-6 py-4 bg-primary hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Pagar Ahora <span className="material-symbols-outlined text-[20px]">lock</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
