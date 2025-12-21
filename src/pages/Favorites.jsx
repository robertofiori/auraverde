
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
    const { userData, currentUser } = useAuth();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const favoriteIds = userData?.favorites || [];
    const favoriteProducts = products.filter(p => favoriteIds.includes(p.firestoreId));

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">lock</span>
                <h2 className="text-xl font-bold mb-2">Inicia sesión</h2>
                <p className="text-gray-500 mb-4">Necesitas una cuenta para guardar tus plantas favoritas.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
                >
                    Ir al Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <div className="md:hidden">
                <Header title="Favoritos" showSearch={false} />
            </div>

            <div className="hidden md:block mb-6 pt-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mis Favoritos</h2>
                <p className="text-slate-500 text-lg">Tu colección de sueños verdes</p>
            </div>

            {favoriteProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 text-center opacity-60">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">favorite_border</span>
                    <p className="text-lg font-medium">Aún no tienes favoritos</p>
                    <p className="text-sm">Explora el catálogo y dale amor a las plantas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-6 px-6 md:px-0 pb-24">
                    {favoriteProducts.map(product => (
                        <ProductCard
                            key={product.firestoreId}
                            {...product}
                            id={product.firestoreId}
                            onAddToCart={() => addToCart(product)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
