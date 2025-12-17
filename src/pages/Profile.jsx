import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden mx-auto max-w-md bg-background-light dark:bg-background-dark pb-24 shadow-2xl">
      {/* Top App Bar */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 justify-between border-b border-gray-100 dark:border-white/5">
        <div className="w-12"></div> {/* Spacer for centering */}
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Perfil</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center rounded-full h-10 w-10 text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center pt-6 pb-6 px-4">
        <div className="relative group cursor-pointer">
          <div className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-4 border-white dark:border-surface-dark shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjVPlt4ReSe6ksHYS1Nfe1zKOpIw3pGmE14kLqTXJ-8KY4bKOH1JjeOr_ARM4ShlKZMG8JfyYkd7KgDhrAMo1ScQ543YJpjv2C1WoSlpkSk3y6utFBqZXjGLxpI6_juqHJBINmRVWX0ftNj6j69_b_88C4HsSvpN-vxLhxH_B9YDrJeEa-40Ck_QnrFbgCKiNLbUvCl_3ATD2x_riNTbMAtnLtbHe309o3cTa9RwbaUhboeT2D4wqh34x7iDruY5vw9jmh8DJjgOZx")' }}></div>
          <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-white dark:border-surface-dark shadow-sm">
            <span className="material-symbols-outlined text-black text-[18px]">edit</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-center text-text-main dark:text-white">Alex Green</h1>
          <p className="text-text-muted dark:text-gray-400 text-sm font-medium mt-1">alex.green@example.com</p>
          <div className="mt-3 bg-primary/20 px-3 py-1 rounded-full">
            <p className="text-black dark:text-primary text-xs font-bold uppercase tracking-wider">Amante de Suculentas</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 px-4 pb-6">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-text-main dark:text-white text-xl font-bold">12</p>
          <p className="text-text-muted dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Pedidos</p>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-text-main dark:text-white text-xl font-bold">24</p>
          <p className="text-text-muted dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Favoritos</p>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-primary text-xl font-bold">350</p>
          <p className="text-text-muted dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Puntos</p>
        </div>
      </div>

      {/* Menu Section: My Garden */}
      <div className="px-4 mt-2 mb-2">
        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight px-1 pb-3">Mi Jardín</h3>
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
          {/* List Item */}
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-black group-hover:text-black transition-colors">local_shipping</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-text-main dark:text-white text-base font-semibold leading-normal">Mis Pedidos</p>
              <p className="text-text-muted dark:text-gray-400 text-xs">2 en progreso</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>
          {/* List Item */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-black group-hover:text-black transition-colors">potted_plant</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-text-main dark:text-white text-base font-semibold leading-normal">Favoritos</p>
              <p className="text-text-muted dark:text-gray-400 text-xs">24 items guardados</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>
          {/* List Item */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-black group-hover:text-black transition-colors">water_drop</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-text-main dark:text-white text-base font-semibold leading-normal">Recordatorios</p>
              <p className="text-text-muted dark:text-gray-400 text-xs">Regar Aloe Vera hoy</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Menu Section: Account Settings */}
      <div className="px-4 mt-6 mb-2">
        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight px-1 pb-3">Ajustes</h3>
        <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
          {/* List Item */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 shrink-0 size-10">
              <span className="material-symbols-outlined text-text-main dark:text-white">location_on</span>
            </div>
            <p className="text-text-main dark:text-white text-base font-medium leading-normal flex-1 text-left">Direcciones de Envío</p>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>
          {/* List Item */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 shrink-0 size-10">
              <span className="material-symbols-outlined text-text-main dark:text-white">credit_card</span>
            </div>
            <p className="text-text-main dark:text-white text-base font-medium leading-normal flex-1 text-left">Métodos de Pago</p>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>
          {/* List Item */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 shrink-0 size-10">
              <span className="material-symbols-outlined text-text-main dark:text-white">notifications</span>
            </div>
            <p className="text-text-main dark:text-white text-base font-medium leading-normal flex-1 text-left">Notificaciones</p>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-6 mb-8">
        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Cerrar Sesión
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Version 2.4.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
