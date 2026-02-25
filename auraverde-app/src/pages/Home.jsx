import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    // Get products independently or pass from a parent context if we wanted to optimize
    const { products, loading } = useProducts();

    // Get first 4 products for featured section (once loaded)
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="md:hidden">
                <Header title="Inicio" showSearch={false} />
            </div>
            {/* Hero Section */}
            <section className="relative h-[500px] w-full bg-surface-light dark:bg-surface-dark overflow-hidden flex items-center justify-center text-center px-4">
                {/* Background Image/Gradient Decor */}
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 bg-[url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark z-0"></div>

                <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6 animate-fade-in-up">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-primary/10 border border-emerald-200 dark:border-primary/20 text-emerald-800 dark:text-primary font-bold text-sm uppercase tracking-wider mb-2">
                        Nueva Colección 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Lleva la Naturaleza a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Casa</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                        Transforma tu espacio con nuestra colección curada de suculentas premium. Entregadas frescas desde nuestro vivero hasta tu puerta.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => navigate('/catalog')}
                            className="px-8 py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                        >
                            Comprar Ahora
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Value Propositions */}
            <section className="py-16 px-6 bg-white dark:bg-surface-dark/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "local_shipping",
                            title: "Envío Gratis",
                            text: "En órdenes mayor a 5 suculentas",
                            action: () => navigate('/catalog')
                        },
                        {
                            icon: "verified",
                            title: "Garantía de Calidad",
                            text: "Plantas sanas o dinero devuelto",
                            action: () => {
                                showToast("Escribenos y juntos solucionaremos el inconveniente", "info");
                                setTimeout(() => {
                                    window.location.href = "mailto:auraverdesuculentas@gmail.com";
                                }, 2500);
                            }
                        },
                        {
                            icon: "support_agent",
                            title: "Soporte Experto",
                            text: "Consejos de cuidado 24/7",
                            action: () => {
                                showToast("Cuentanos en que podemos ayudarte", "info");
                                setTimeout(() => {
                                    window.open("https://www.instagram.com/auraverdesuculentas/", "_blank");
                                }, 2500);
                            }
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={item.action}
                            className="flex flex-col items-center text-center p-6 rounded-3xl bg-background-light dark:bg-background-dark border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Plantas Destacadas</h2>
                        <p className="text-slate-500 mt-2">Más vendidas elegidas para ti</p>
                    </div>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="hidden md:flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all"
                    >
                        Ver Todas <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.firestoreId || product.id}
                            {...product}
                            onAddToCart={() => addToCart(product)}
                        />
                    ))}
                </div>

                <button
                    onClick={() => navigate('/catalog')}
                    className="mt-10 w-full md:hidden py-3 border-2 border-primary/20 text-primary font-bold rounded-xl active:bg-primary/5"
                >
                    Ver Catalogo Completo
                </button>
            </section>

            <div className="md:hidden pb-20">
                <Footer />
            </div>
        </div>
    );
}
