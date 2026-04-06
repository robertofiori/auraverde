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
    const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // 'mercadopago' or 'bank_transfer'

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
            const orderData = {
                items: cartItems,
                subtotal,
                tax,
                total,
                shippingAddress: userData.shippingAddress,
                paymentMethod: paymentMethod, // Store choice
                paymentLast4: paymentMethod === 'mercadopago' ? 'MercadoPago' : 'Transferencia',
                status: paymentMethod === 'mercadopago' ? 'pending_payment' : 'waiting_transfer',
                date: new Date().toLocaleDateString()
            };

            const id = await createOrder(orderData);
            setOrderId(id);

            // If it's a bank transfer, we can go straight to success page
            if (paymentMethod === 'bank_transfer') {
                clearCart();
                navigate('/success', { state: { orderId: id, paymentMethod: 'bank_transfer' } });
            }

        } catch (error) {
            console.error("Checkout failed", error);
            alert("Error: " + error.message);
            setIsProcessing(false);
        }
    };

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

                {/* Left Col: Info & Payment Method */}
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

                    {/* Payment Method Selection */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            Método de Pago
                        </h2>

                        <div className="flex flex-col gap-3">
                            {/* Mercado Pago Option */}
                            <button
                                onClick={() => setPaymentMethod('mercadopago')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === 'mercadopago' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Mercado Pago</p>
                                        <p className="text-xs text-slate-500">Tarjetas, Débito o Saldo MP</p>
                                    </div>
                                </div>
                                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mercadopago' ? 'border-primary' : 'border-gray-300'}`}>
                                    {paymentMethod === 'mercadopago' && <div className="size-2.5 rounded-full bg-primary animate-scale-in"></div>}
                                </div>
                            </button>

                            {/* Bank Transfer Option */}
                            <button
                                onClick={() => setPaymentMethod('bank_transfer')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-600">account_balance</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Transferencia / Alias</p>
                                        <p className="text-xs text-slate-500">Paga desde tu app bancaria</p>
                                    </div>
                                </div>
                                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'border-primary' : 'border-gray-300'}`}>
                                    {paymentMethod === 'bank_transfer' && <div className="size-2.5 rounded-full bg-primary animate-scale-in"></div>}
                                </div>
                            </button>

                            {/* Bank Transfer Instructions (Conditional) */}
                            {paymentMethod === 'bank_transfer' && (
                                <div className="mt-2 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 animate-fade-in">
                                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2">Datos para Transferencia</p>
                                    <div className="flex items-center justify-between bg-white dark:bg-black/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Alias Mercado Pago</p>
                                            <p className="font-black text-slate-900 dark:text-white text-sm">farenheit.com.mp</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText('farenheit.com.mp');
                                                alert("Alias copiado al portapapeles");
                                            }}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-primary">content_copy</span>
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-emerald-700 dark:text-emerald-500 mt-2 italic">
                                        * Envía el comprobante por WhatsApp una vez realizado el pago, lo encontraras en <button onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="underline font-bold hover:text-primary transition-colors">Contactos</button>
                                    </p>
                                </div>
                            )}
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
                                    <div className="flex-1">
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
                                <span className="text-2xl">${total.toFixed(2)}</span>
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
                                    {isProcessing ? (
                                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                            {paymentMethod === 'mercadopago' ? 'Confirmar Datos y Pagar' : 'Confirmar Pedido'}
                                        </>
                                    )}
                                </button>
                            ) : (
                                paymentMethod === 'mercadopago' ? (
                                    <MercadoPagoCheckout orderId={orderId} total={total} items={cartItems} shippingCost={shippingCost} />
                                ) : (
                                  <div className="animate-fade-in text-center p-4">
                                      <p className="text-sm text-slate-500 mb-4">Pedido creado con éxito.</p>
                                      <button
                                          onClick={() => {
                                              clearCart();
                                              navigate('/success', { state: { orderId: orderId, paymentMethod: 'bank_transfer' } });
                                          }}
                                          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg"
                                      >
                                          Ver Comprobante
                                      </button>
                                  </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
