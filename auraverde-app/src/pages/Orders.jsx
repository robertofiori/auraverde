import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

export default function Orders() {
    const navigate = useNavigate();
    const { orders, loading, error } = useOrders();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-4 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-surface-dark transition-colors"
                >
                    <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mis Pedidos</h1>
            </div>

            <div className="flex-1 p-4 max-w-3xl mx-auto w-full">

                {loading && (
                    <div className="mt-10 flex justify-center text-primary">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                    </div>
                )}

                {!loading && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-white dark:bg-surface-dark rounded-2xl shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-emerald-200 dark:text-emerald-900/40 mb-4">local_shipping</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sin pedidos aún</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Tu historial está vacío. ¡Es hora de llenar el jardín!</p>
                        <button onClick={() => navigate('/catalog')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                            Ir al Catálogo
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex gap-4">
                            {/* Use first item image or placeholder */}
                            <div className="size-20 bg-gray-100 rounded-xl bg-center bg-cover shrink-0"
                                style={{ backgroundImage: `url(${order.items?.[0]?.image || 'https://via.placeholder.com/150'})` }}>
                                {order.items?.length > 1 && (
                                    <div className="flex items-center justify-center h-full w-full bg-black/40 text-white font-bold rounded-xl backdrop-blur-sm">
                                        +{order.items.length - 1}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm uppercase tracking-wider text-slate-500">
                                        ID: {order.id.slice(0, 8)}...
                                    </h3>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                    {order.items?.[0]?.name} {order.items?.length > 1 ? `y ${order.items.length - 1} más` : ''}
                                </p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs text-slate-400">{order.dateStr}</span>
                                    <span className="font-bold text-primary">${order.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
