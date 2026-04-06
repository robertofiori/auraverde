import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAddresses } from '../hooks/useAddresses';
import { calculateShippingCost } from '../utils/shipping';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, subtotal, total, shippingCost, setShippingCost, selectedAddress, setSelectedAddress } = useCart();
  const { addresses, addAddress, loading: loadingAddresses } = useAddresses();
  const { currentUser, userData } = useAuth();
  const [isCalculating, setIsCalculating] = useState(false);
  const { showToast } = useToast();

  const hasValidAddress = userData?.shippingAddress?.address && userData?.shippingAddress?.city;
  /* Effect to calculate shipping when userData loads */
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  /* Effect to calculate shipping when userData loads */
  useEffect(() => {
    if (currentUser && userData?.shippingAddress) {
      // Auto-select and calculate
      const address = userData.shippingAddress;

      const calculate = async () => {
        setIsCalculating(true);
        try {
          const fullAddress = `${address.address}, ${address.city}, ${address.zip}`;
          // Pass item count for free shipping logic
          const cost = await calculateShippingCost(fullAddress, itemCount);
          setShippingCost(cost);
          setSelectedAddress(address);
        } catch (error) {
          console.error("Error calculating shipping:", error);
          setShippingCost(0);
        } finally {
          setIsCalculating(false);
        }
      };
      calculate();
    } else {
      setShippingCost(0);
      setSelectedAddress(null);
    }
  }, [currentUser, userData, itemCount]); // Recalculate when items change

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-32 bg-background-light dark:bg-background-dark md:pb-0">

      <Header showSearch={false} />

      <div className="px-6 py-4 md:py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mi Carrito</h1>
          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{itemCount} items</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full overflow-hidden">
        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-0 hide-scrollbar">
          <div className="flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-inner animate-pulse-slow">
                  <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">shopping_basket</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu carrito está vacío</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8">Parece que aún no tienes plantas en tu carrito.</p>
                <button 
                  onClick={() => navigate('/catalog')} 
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group relative flex flex-col gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50 md:flex-row md:items-center hover:shadow-md transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 flex-1">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-center bg-no-repeat bg-cover rounded-lg aspect-square w-20 h-20 shrink-0 bg-gray-200" style={{ backgroundImage: `url("${item.image}")` }}></div>
                      <div className="flex flex-col justify-center h-full">
                        <p className="text-text-main dark:text-white text-base font-bold leading-normal line-clamp-1">{item.name}</p>
                        <p className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal mb-2">{item.type}</p>
                        <p className="text-text-main dark:text-primary text-base font-bold leading-normal">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors md:self-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3 mt-1 md:border-t-0 md:pt-0 md:mt-0 md:justify-end md:gap-6">
                    <span className="text-xs text-text-secondary dark:text-gray-500 font-medium md:hidden">Cantidad</span>
                    <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-full p-1 px-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white hover:bg-gray-5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-8 text-center text-text-main dark:text-white font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-text-main shadow-sm hover:brightness-110 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkout Section (Fixed on mobile, Side on desktop) */}
        {cartItems.length > 0 && (
          <div className="
            fixed bottom-0 left-0 right-0 glass border-t-0 p-6 pb-40 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.15)] dark:shadow-none z-20 animate-fade-in-up
            md:static md:w-96 md:h-fit md:rounded-[2rem] md:p-8 md:pb-8 md:animate-none
          ">
            <div className="flex flex-col gap-4 max-w-md mx-auto w-full">

              {/* Shipping & Address Selection */}
              <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Envío</h3>

                {!currentUser ? (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Inicia sesión para gestionar tu dirección y calcular el envío.
                  </div>
                ) : (
                  <>
                    {/* Single Address Display */}
                    {hasValidAddress ? (
                      <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-primary bg-primary/5">
                        <div className="text-sm">
                          <p className="font-bold text-slate-900 dark:text-white">Dirección de Envío</p>
                          <p className="text-slate-500">
                            {userData.shippingAddress.address}, {userData.shippingAddress.city}, {userData.shippingAddress.zip}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/profile')}
                          className="text-primary font-bold text-xs hover:underline"
                        >
                          CAMBIAR
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-500">No tienes una dirección de envío guardada.</p>
                        <button
                          onClick={() => navigate('/profile')}
                          className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 text-slate-500 hover:text-primary hover:border-primary/50 transition-colors text-sm font-medium"
                        >
                          <span className="material-symbols-outlined text-lg">add_location</span>
                          AGREGAR
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Promo Code (Desktop only visible here for simplicity, or add back) */}

              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-gray-400 text-sm font-medium">Subtotal</span>
                  <span className="text-text-main dark:text-white text-sm font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-gray-400 text-sm font-medium">Envío</span>
                  <span className={`text-sm font-bold ${shippingCost === 0 ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                    {isCalculating ? 'Calculando...' : (shippingCost > 0 ? `$${shippingCost}` : (selectedAddress ? 'Gratis' : 'Seleccionar dirección'))}
                  </span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-900 dark:text-white text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-gradient leading-none">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!hasValidAddress) {
                    showToast("Debe tener una direccion de envio para poder comprar, por favor agreguelo", "error");
                  } else {
                    navigate('/checkout');
                  }
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl h-14 bg-primary text-text-main text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 disabled:opacity-50 disabled:pointer-events-none`}
                disabled={isCalculating}
              >
                <span>{isCalculating ? 'Calculando...' : 'Pagar'}</span>
                {!isCalculating && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
