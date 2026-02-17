import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small timeout to allow enter animation
        const showTimer = setTimeout(() => setIsVisible(true), 10);

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish before unmounting
            setTimeout(onClose, 300);
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, onClose]);

    return (
        <div
            className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 min-w-[300px] max-w-md
        transition-all duration-300 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
        bg-surface-light dark:bg-surface-dark border border-primary/20
      `}
        >
            <div className={`
        flex items-center justify-center w-10 h-10 rounded-full shrink-0
        ${type === 'success' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'}
      `}>
                <span className="material-symbols-outlined">
                    {type === 'success' ? 'check_circle' : 'info'}
                </span>
            </div>

            <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {message}
                </p>
            </div>

            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    );
}
