import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import Header from '../components/Header';


export default function Home() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    // Get products independently or pass from a parent context if we wanted to optimize
    const { products, loading } = useProducts();

    // Get products with 'nuevo' or 'oferta' badges for featured section
    const featuredProducts = products
        .filter(p => p.badge === 'nuevo' || p.badge === 'oferta')
        .slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="mb-0">
                <Header title="Inicio" showSearch={false} />
            </div>
            {/* Hero Section */}
            <section className="relative min-h-[600px] md:h-[700px] w-full bg-surface-light dark:bg-surface-dark overflow-hidden flex items-center justify-center text-center px-4 pt-20 pb-32 md:pb-20">
                {/* Background Image/Gradient Decor */}
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 bg-[url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark z-0"></div>

                <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6 animate-fade-in-up">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-primary/10 border border-emerald-200/50 dark:border-primary/20 text-emerald-800 dark:text-primary font-bold text-sm uppercase tracking-wider mb-2 backdrop-blur-sm">
                        Nueva Colección 2026
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.2] md:leading-[1.1] tracking-tight">
                        Lleva la <span className="text-gradient">Naturaleza</span> a Casa
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        Transforma tu espacio con nuestra colección curada de suculentas premium. Entregadas frescas desde nuestro vivero hasta tu puerta en un empaque diseñado para su cuidado.
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
            <section className="py-20 px-6 bg-slate-50/50 dark:bg-transparent relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
                            className="glass flex flex-col items-center text-center p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer hover:border-primary/40 group animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.text}</p>
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

        </div>
    );
}
