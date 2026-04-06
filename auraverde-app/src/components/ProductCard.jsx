import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ id, name, type, price, image, isNew, badge, onAddToCart }) {
  const { toggleFavorite, userData } = useAuth();
  const { showToast } = useToast();
  const isFavorite = userData?.favorites?.includes(id);

  // Determine which badge to show (mutually exclusive)
  const activeBadge = badge || (isNew ? 'nuevo' : null);

  return (
    <div className="group flex flex-col gap-4 animate-scale-in hover:-translate-y-2 transition-all duration-500">
      <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-surface-dark shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
        <Link to={`/product/${id}`}>
          <img
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image}
          />
        </Link>

        {activeBadge && activeBadge !== 'none' && (
          <div className={`absolute top-4 left-4 px-3 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10 backdrop-blur-md
            ${activeBadge === 'nuevo' ? 'bg-emerald-500/90' : 'bg-rose-500/90'}
          `}>
            {activeBadge}
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
            if (onAddToCart) {
                onAddToCart();
                showToast(`${name} añadido al carrito`, 'success');
            }
          }}
          className="absolute bottom-4 right-4 z-10 h-12 w-12 rounded-2xl bg-white/90 dark:bg-primary/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl active:scale-95 transition-all hover:scale-110 hover:bg-primary dark:hover:bg-white group/btn cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px] group-hover/btn:rotate-90 transition-transform duration-300">add</span>
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
