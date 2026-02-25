export default function FilterChip({ label, active, onClick }) {
  if (active) {
    return (
      <button 
        onClick={onClick}
        className="flex h-10 shrink-0 items-center justify-center px-5 rounded-full bg-primary text-slate-900 font-bold shadow-sm shadow-primary/20"
      >
        {label}
      </button>
    );
  }
  return (
    <button 
      onClick={onClick}
      className="flex h-10 shrink-0 items-center justify-center px-5 rounded-full bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap"
    >
      {label}
    </button>
  );
}
