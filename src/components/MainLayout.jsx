import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../context/AuthContext';
import SocialLinks from './SocialLinks';
import ThemeToggle from './ThemeToggle';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();

  const navItems = [
    { icon: "home", label: "Inicio", path: "/" },
    { icon: "search", label: "Buscar", path: "/catalog" },
    { icon: "shopping_cart", label: "Carrito", path: "/cart" },
    { icon: "person", label: "Perfil", path: "/profile" }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-background-dark p-6 sticky top-0 h-screen">
        <div className="flex flex-col items-center -mt-2 mb-10 px-2 w-full">
          <Link to="/" className="w-40 h-40 flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-105 active:scale-95 active:rotate-3 cursor-pointer">
            <img src={`${import.meta.env.BASE_URL}logolocal.svg`} alt="AuraVerde Logo" className="w-full h-full object-contain animate-float" />
          </Link>
          <h1 className="font-varela text-3xl text-primary font-bold tracking-wide -mt-6 text-center w-full leading-none">
            AURA VERDE
          </h1>

        </div>


        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left
                ${isActive(item.path)
                  ? 'bg-primary text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/20'
                  : 'text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white'
                }`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'font-bold' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
          {currentUser ? (
            <>
              {userRole === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-3 p-3 rounded-xl w-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  <span className="font-medium text-sm">Panel Maestro</span>
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-3 p-3 rounded-xl w-full text-text-secondary dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="font-medium text-sm">Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 p-3 rounded-xl w-full text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <span className="material-symbols-outlined">login</span>
              <span className="font-medium text-sm">Iniciar Sesión</span>
            </button>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-6 w-full">
            <ThemeToggle />
            <SocialLinks />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:p-8 pb-24 md:pb-8">
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        {!['/cart', '/checkout'].includes(location.pathname) && !location.pathname.startsWith('/product/') && <BottomNav />}
      </div>
    </div>
  );
}
