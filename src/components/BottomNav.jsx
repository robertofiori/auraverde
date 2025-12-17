import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => path.startsWith(route);

  return (
    <nav className="absolute bottom-0 w-full border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark pb-6 pt-2 px-6 shrink-0 z-20">
      <div className="flex justify-between items-end">
        <Link to="/" className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/') && path === '/' ? 'text-primary relative' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          {isActive('/') && path === '/' && <div className="absolute -top-10 bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center blur-lg opacity-50"></div>}
          <span className={`material-symbols-outlined text-2xl ${isActive('/') && path === '/' ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}>home</span>
          <span className={`text-[10px] ${isActive('/') && path === '/' ? 'font-bold' : 'font-medium'}`}>Inicio</span>
        </Link>

        <Link to="/catalog" className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/catalog') ? 'text-primary relative' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          {isActive('/catalog') && <div className="absolute -top-10 bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center blur-lg opacity-50"></div>}
          <span className={`material-symbols-outlined text-2xl ${isActive('/catalog') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}>grid_view</span>
          <span className={`text-[10px] ${isActive('/catalog') ? 'font-bold' : 'font-medium'}`}>Catálogo</span>
        </Link>

        <Link to="/favorites" className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/favorites') ? 'text-primary relative' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          {isActive('/favorites') && <div className="absolute -top-10 bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center blur-lg opacity-50"></div>}
          <span className={`material-symbols-outlined text-2xl ${isActive('/favorites') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}>favorite</span>
          <span className={`text-[10px] ${isActive('/favorites') ? 'font-bold' : 'font-medium'}`}>Favoritos</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/profile') ? 'text-primary relative' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          {isActive('/profile') && <div className="absolute -top-10 bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center blur-lg opacity-50"></div>}
          <span className={`material-symbols-outlined text-2xl ${isActive('/profile') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}>person</span>
          <span className={`text-[10px] ${isActive('/profile') ? 'font-bold' : 'font-medium'}`}>Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
