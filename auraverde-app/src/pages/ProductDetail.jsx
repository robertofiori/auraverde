import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProduct } from '../hooks/useProducts';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-primary font-bold">Cargando producto...</div>;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Producto no encontrado</h2>
        <button onClick={() => navigate('/catalog')} className="text-primary font-bold">Volver al Catálogo</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add item multiple times based on quantity
    // Changes to CartContext would be better to support quantity, but for now loop calls
    // Or update context to accept q value. My context supports existing check but assumes +1.
    // Let's just loop for now or update context to take quantity?
    // Looking at CartContext: `addToCart` adds 1. `updateQuantity` sets delta.
    // I can stick to calling addToCart multiple times or just update logic.
    // Simpler: Just call addToCart once for now, or loop. Let's loop.
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark">
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 pt-12 md:pt-6 bg-gradient-to-b from-black/40 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/30"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/30">
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/30">
            <span className="material-symbols-outlined text-2xl">favorite</span>
          </button>
        </div>
      </header>

      {/* Hero Image / Carousel Section */}
      <div className="relative w-full h-[55vh] lg:h-[75vh] shrink-0 bg-gray-50 dark:bg-gray-950 overflow-hidden flex items-center justify-center">
        {/* Animated Blurred Background (Desktop only) */}
        <div className="absolute inset-0 hidden lg:block overflow-hidden transition-all duration-1000">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-[80px] opacity-40 dark:opacity-30 transition-all duration-700"
            style={{ backgroundImage: `url(${activeImageIndex === 0 ? product.image : (product.image2 || product.image)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background-light dark:to-background-dark" />
        </div>

        {/* Images Carousel */}
        <div className="relative z-10 w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}>
          {/* Main Image Container */}
          <div className="w-full h-full shrink-0 flex items-center justify-center p-0 lg:p-14">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full lg:w-auto lg:max-h-full object-cover lg:object-contain lg:rounded-3xl lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] transition-all duration-500"
            />
          </div>

          {/* Secondary Image Container */}
          {product.image2 && (
            <div className="w-full h-full shrink-0 flex items-center justify-center p-0 lg:p-14">
              <img
                src={product.image2}
                alt={`${product.name} - Alternativa`}
                className="w-full h-full lg:w-auto lg:max-h-full object-cover lg:object-contain lg:rounded-3xl lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] transition-all duration-500"
              />
            </div>
          )}
        </div>

        {/* Carousel Navigation Indicators */}
        {product.image2 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            <button
              onClick={() => setActiveImageIndex(0)}
              className={`h-1.5 w-10 rounded-full transition-all duration-300 ${activeImageIndex === 0 ? 'bg-primary scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'}`}
            />
            <button
              onClick={() => setActiveImageIndex(1)}
              className={`h-1.5 w-10 rounded-full transition-all duration-300 ${activeImageIndex === 1 ? 'bg-primary scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'}`}
            />
          </div>
        )}

        {/* Desktop Navigation Arrows */}
        {product.image2 && (
          <div className="absolute inset-0 z-20 hidden lg:flex items-center justify-between px-8 pointer-events-none">
            <button
              onClick={() => setActiveImageIndex(0)}
              className={`h-14 w-14 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white pointer-events-auto transition-all hover:bg-primary hover:text-black hover:scale-110 active:scale-95 ${activeImageIndex === 0 ? 'opacity-30 cursor-default' : 'opacity-100 shadow-xl'}`}
            >
              <span className="material-symbols-outlined text-3xl">chevron_left</span>
            </button>
            <button
              onClick={() => setActiveImageIndex(1)}
              className={`h-14 w-14 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white pointer-events-auto transition-all hover:bg-primary hover:text-black hover:scale-110 active:scale-95 ${activeImageIndex === 1 ? 'opacity-30 cursor-default' : 'opacity-100 shadow-xl'}`}
            >
              <span className="material-symbols-outlined text-3xl">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Sheet */}
      <main className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-3xl bg-background-light dark:bg-background-dark px-6 pt-8 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Title & Rating */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{product.name}</h1>
                {(product.badge || product.isNew) && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm
                    ${(product.badge === 'oferta') ? 'bg-red-500' : 'bg-emerald-500'}
                  `}>
                    {product.badge === 'oferta' ? 'Oferta' : 'Nuevo'}
                  </span>
                )}
              </div>
              <p className="text-lg italic text-gray-500 dark:text-gray-400">{product.type}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="material-symbols-outlined text-yellow-400 fill-current text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">4.8</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">(120 reseñas)</span>
          </div>
        </div>


        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Descripción</h3>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {product.name} es una hermosa planta. Perfecta para agregar un toque de naturaleza a tu hogar u oficina.
            <span className="font-bold text-primary cursor-pointer ml-1">Leer más</span>
          </p>
        </div>

        {/* Care Tips */}
        {(product.careLuz || product.careAgua || product.careTemp) && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Cuidados</h3>
            <div className="grid grid-cols-3 gap-3">
              {product.careLuz && (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                    <span className="material-symbols-outlined">wb_sunny</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-900 dark:text-white">Luz</span>
                    <span className="block text-[10px] text-gray-500">{product.careLuz}</span>
                  </div>
                </div>
              )}
              {product.careAgua && (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                    <span className="material-symbols-outlined">water_drop</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-900 dark:text-white">Agua</span>
                    <span className="block text-[10px] text-gray-500">{product.careAgua}</span>
                  </div>
                </div>
              )}
              {product.careTemp && (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
                    <span className="material-symbols-outlined">thermostat</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-900 dark:text-white">Temp</span>
                    <span className="block text-[10px] text-gray-500">{product.careTemp}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pot Sizes Section moved under Care */}
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 text-center">Tamaño Seleccionado</h3>
              <div className="flex justify-center gap-3">
                {[
                  { id: 'pequena', name: 'Pequeña', icon: 'eco', val: product.potPequeña },
                  { id: 'mediana', name: 'Mediana', icon: 'nature', val: product.potMediana },
                  { id: 'grande', name: 'Grande', icon: 'forest', val: product.potGrande }
                ].map((size) => (
                  <div
                    key={size.id}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all duration-500 w-1/3
                      ${product.potDefault === size.id
                        ? 'bg-primary border-primary shadow-lg shadow-primary/20 text-black scale-105 z-10'
                        : 'bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-gray-800 text-gray-400 opacity-30'}
                    `}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                      ${product.potDefault === size.id ? 'bg-black/10' : 'bg-gray-100 dark:bg-gray-800'}
                    `}>
                      <span className="material-symbols-outlined text-xl">{size.icon}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] font-black uppercase tracking-tight">{size.name}</span>
                    </div>
                    {product.potDefault === size.id && (
                      <div className="absolute top-1 right-1">
                        <span className="material-symbols-outlined text-xs font-black">check_circle</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-6"></div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 dark:border-gray-800 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-lg pb-safe pt-4 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-center pb-6 md:pb-0">
          <div className="flex w-full items-center justify-between gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm transition active:scale-95 text-gray-900 dark:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-5 text-center text-sm font-black text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm transition active:scale-95 text-gray-900 dark:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 px-3 text-black shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95 min-h-[48px]"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <div className="flex flex-wrap items-center justify-center gap-x-1">
                <span className="text-[13px] sm:text-base font-black uppercase tracking-tight">Agregar</span>
                <span className="text-[11px] sm:text-sm font-bold opacity-80 whitespace-nowrap">| ${(product.price * quantity).toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>
    </div>
  );
}
