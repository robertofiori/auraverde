import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route, exact = false) => exact ? path === route : path.startsWith(route);

  // Mapeamos los items solicitados: Carrito, Ofertas, Inicio (Central), Perfil, Favoritos
  return (
    <nav className="w-full relative px-4 pb-4">
      <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-between px-4 md:px-8 h-24">
        
        {/* Lado Izquierdo */}
        <div className="flex w-[40%] justify-around items-center">
          <Link to="/cart" className={`flex flex-col items-center gap-1 transition-all group p-4 min-w-[72px] rounded-2xl active:scale-90 ${isActive('/cart') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
            <span className={`material-symbols-outlined text-3xl md:text-3xl ${isActive('/cart') ? 'fill-current scale-110' : 'group-hover:scale-110 transition-transform'}`}>shopping_cart</span>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-80">Carrito</span>
          </Link>

          <Link to="/catalog?badge=oferta" className={`flex flex-col items-center gap-1 transition-all group p-4 min-w-[72px] rounded-2xl active:scale-90 ${location.search.includes('oferta') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
            <span className={`material-symbols-outlined text-3xl md:text-3xl ${location.search.includes('oferta') ? 'fill-current scale-110' : 'group-hover:scale-110 transition-transform'}`}>local_offer</span>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-80">Ofertas</span>
          </Link>
        </div>

        {/* Boton Central Flotante (Logo / Inicio) */}
        <div className="w-[20%] flex justify-center -mt-12 relative z-10">
          <Link to="/" className="flex flex-col items-center group">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 active:scale-95 ${isActive('/', true) ? 'bg-primary' : 'bg-slate-900 border-4 border-white dark:border-slate-800'} overflow-hidden p-3`}>
              <img 
                src={`${import.meta.env.BASE_URL}logolocal.svg`} 
                alt="Logo" 
                className={`w-full h-full object-contain ${isActive('/', true) ? 'brightness-0' : 'filter drop-shadow-sm'}`} 
              />
            </div>
            <span className={`text-[10px] md:text-xs font-black tracking-widest uppercase mt-3 ${isActive('/', true) ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>INICIO</span>
          </Link>
        </div>

        {/* Lado Derecho */}
        <div className="flex w-[40%] justify-around items-center">
          <Link to="/profile" className={`flex flex-col items-center gap-1 transition-all group p-4 min-w-[72px] rounded-2xl active:scale-90 ${isActive('/profile') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center mb-1 shadow-sm transition-transform group-hover:scale-110 ${isActive('/profile') ? 'bg-primary text-white border-2 border-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'}`}>
              <span className="font-bold text-sm md:text-base">R</span>
            </div>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-80">Perfil</span>
          </Link>

          <Link to="/favorites" className={`flex flex-col items-center gap-1 transition-all group p-4 min-w-[72px] rounded-2xl active:scale-90 ${isActive('/favorites') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
            <span className={`material-symbols-outlined text-3xl md:text-3xl ${isActive('/favorites') ? 'fill-current scale-110' : 'group-hover:scale-110 transition-transform'}`}>favorite</span>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-80">Favoritos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
