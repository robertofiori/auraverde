import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Header({ title = "Catálogo", showSearch = true, onSearch, searchValue }) {
  const { currentUser, logout, userRole } = useAuth();

  return (
    <>
      <header className="relative flex items-center justify-between px-6 py-4 bg-background-light dark:bg-background-dark z-10 shrink-0 gap-4 h-24">
        
        {/* Left side: Theme Toggle & Admin */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0 z-10">
          <ThemeToggle />
          {currentUser && userRole === 'admin' && (
            <Link to="/admin" className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-emerald-500" title="Panel Admin">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </Link>
          )}
        </div>

        {/* Center: Brand Name */}
        <Link 
          to="/" 
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group z-[100]"
          title="Ir al Inicio"
        >
          <h1 className="text-2xl md:text-4xl font-varela font-black tracking-[0.2em] text-primary dark:text-primary transition-all duration-300 drop-shadow-[0_0_15px_rgba(19,236,55,0.3)] hover:scale-105 active:scale-95 uppercase whitespace-nowrap">
            Aura Verde
          </h1>
        </Link>

        {/* Desktop Search */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-sm mr-4 z-10 ml-auto justify-end">
             <div className="relative flex items-center w-64 h-11 rounded-xl bg-slate-100 dark:bg-surface-dark/80 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-slate-700 dark:text-slate-200 pr-4 bg-transparent placeholder-slate-400 font-medium"
                id="search-desktop"
                placeholder="Buscar plantas..."
                type="text"
                value={searchValue}
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Right side: Auth Controls */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0 z-10">
          {!showSearch && (
             <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          )}
          {currentUser ? (
            <button onClick={logout} className="flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-slate-500 hover:text-red-500" title="Cerrar Sesión">
              <span className="material-symbols-outlined text-3xl md:text-3xl">logout</span>
            </button>
          ) : (
            <Link to="/login" className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-primary" title="Iniciar Sesión">
              <span className="material-symbols-outlined text-3xl md:text-3xl">login</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="px-6 pb-4 shrink-0 md:hidden bg-background-light dark:bg-background-dark">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="grid place-items-center h-full w-12 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-slate-700 dark:text-slate-200 pr-2 bg-transparent placeholder-slate-400 font-medium"
              id="search"
              placeholder="Buscar plantas, macetas..."
              type="text"
              value={searchValue}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}
