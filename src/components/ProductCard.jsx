import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ id, name, type, price, image, isNew, onAddToCart }) {
  const { toggleFavorite, userData } = useAuth();
  const isFavorite = userData?.favorites?.includes(id);

  return (
    <div className="group flex flex-col gap-3">
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-surface-dark">
        <Link to={`/product/${id}`}>
          <img
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image}
          />
        </Link>
        {isNew && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-md">
            Nuevo
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white dark:hover:bg-surface-dark group/fav"
        >
          <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-white group-hover/fav:text-red-500'}`}>
            {isFavorite ? 'favorite' : 'favorite'}
          </span>
          {/* Note: Google Icons 'favorite' is filled, usually 'favorite_border' is empty. But let's check class usage */}
          <style>{`
               .material-symbols-outlined { font-variation-settings: 'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
             `}</style>
          {/* Actually simpler: separate icons */}
        </button>
        {/* Re-rendering button for clarity without style injection hacks */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite && toggleFavorite(id);
          }}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/20 hover:bg-white/90 dark:hover:bg-surface-dark/90 backdrop-blur-sm flex items-center justify-center transition-all text-white hover:text-red-500"
          title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'text-red-500' : ''}`} style={{ fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}` }}>
            favorite
          </span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart && onAddToCart();
          }}
          className="absolute bottom-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm flex items-center justify-center text-slate-900 dark:text-white shadow-lg active:scale-90 transition-all hover:bg-primary hover:text-slate-900 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">{type}</p>
          </div>
        </div>
        <p className="text-slate-900 dark:text-primary text-sm font-bold mt-2">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
