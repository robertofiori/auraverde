import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors active:scale-95 ${theme === 'dark'
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                    : 'bg-orange-100 text-orange-500 hover:bg-orange-200'
                } ${className}`}
            aria-label="Toggle Theme"
        >
            <span className="material-symbols-outlined text-xl align-middle">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
        </button>
    );
}
