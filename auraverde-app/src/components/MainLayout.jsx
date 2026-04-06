import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function MainLayout() {
  const location = useLocation();

  const showBottomNav = !['/checkout'].includes(location.pathname) && !location.pathname.startsWith('/product/');

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto pb-36 md:pb-32">
        <div className="h-full w-full">
          <Outlet />
        </div>
        {showBottomNav && <Footer />}
      </main>

      {/* Global Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-4 md:pb-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl px-2 md:px-0">
          {showBottomNav && <BottomNav />}
        </div>
      </div>
    </div>
  );
}
