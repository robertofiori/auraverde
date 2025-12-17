import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header({ title = "Catálogo", showSearch = true }) {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-background-light dark:bg-background-dark z-10 shrink-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <Link to="/cart" className="relative flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-slate-900 border-2 border-background-light dark:border-background-dark">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {showSearch && (
        <div className="px-6 pb-2 shrink-0">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="grid place-items-center h-full w-12 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-slate-700 dark:text-slate-200 pr-2 bg-transparent placeholder-slate-400 font-medium"
              id="search"
              placeholder="Buscar plantas..."
              type="text"
            />
          </div>
        </div>
      )}
    </>
  );
}
