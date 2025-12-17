import { Link } from 'react-router-dom';

export default function ProductCard({ id, name, type, price, image, isNew, onAddToCart }) {
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
