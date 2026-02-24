import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useAddresses } from '../hooks/useAddresses'; // kept for compilation, technically unused now
import MercadoPagoCheckout from '../components/MercadoPagoCheckout';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, total, subtotal, tax, clearCart, shippingCost } = useCart();
    const { createOrder } = useOrders();
    const { currentUser, userData } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Redirect if no shipping address
    useEffect(() => {
        if (currentUser && userData && !userData.shippingAddress) {
            alert("Para que podamos enviarte tu pedido necesitamos tu direccion");
            navigate('/profile');
        }
    }, [currentUser, userData, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setIsProcessing(true);

        try {
            // Simulate Payment Delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const orderData = {
                items: cartItems,
                subtotal,
                tax,
                total,
                shippingAddress: userData.shippingAddress, // Use profile address
                paymentLast4: 'MercadoPago',
                status: 'pending_payment',
                date: new Date().toLocaleDateString() // Fallback string
            };

            const id = await createOrder(orderData);
            setOrderId(id);
            // We do NOT clear cart or navigate here. 
            // We wait for the user to proceed with MercadoPago.
            // Clearing cart should happen on success page or webhook handling.

        } catch (error) {
            console.error("Checkout failed", error);
            alert("Error: " + error.message);
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && !orderId) {
        // Only redirect if we don't have an active order being processed
        // But for better UX, maybe just show empty state or redirect effect
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

                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-base">{userData?.displayName || 'Usuario'}</p>
                                <p className="text-slate-600 dark:text-gray-300 text-sm mt-1">{userData?.shippingAddress?.address}</p>
                                <p className="text-slate-500 dark:text-gray-400 text-sm">{userData?.shippingAddress?.city}, {userData?.shippingAddress?.zip}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button onClick={() => navigate('/profile')} className="text-primary text-sm font-bold hover:underline">
                                Editar en Perfil
                            </button>
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
                                <span>Envío</span>
                                {shippingCost === 0 ? (
                                    <span className="text-green-500 font-bold">Gratis</span>
                                ) : (
                                    <span className="font-bold text-slate-900 dark:text-white">${shippingCost.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Action */}
                        <div className="mt-6">
                            {!orderId ? (
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Procesando...' : 'Confirmar Datos y Pagar'}
                                </button>
                            ) : (
                                <MercadoPagoCheckout orderId={orderId} total={total} items={cartItems} shippingCost={shippingCost} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
