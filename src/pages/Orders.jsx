import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const navigate = useNavigate();

    // Mock Data for Orders
    const orders = [
        {
            id: "ORD-2024-001",
            date: "Oct 24, 2024",
            status: "Delivered",
            total: 45.00,
            items: ["Echeveria Lola", "Aloe Vera"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eZ15aq4T37Ryj4bDgj81ZEUyIYsh_RKRe_i8s-gujmUO-i27DiYWUuBzPiPJ_YWIS2p_w47QKZMKDQWOHo6CRndOci24Fq8e8I8K-sMCpajjkdksObyDBwAwTd51gu_8U6d9MPdleEc-8Hnb1zzYYCFR_l_Ypk_iSruncVz3mVHzQopMI-9CTT8lKOVIlGLTyDkJF-HpDQXMvf6jWJpWFFQWuC4q3TuYCE1oQ49Fy4VkatuhBcPfA-InsniE7TV93a8vHXmlmM7L"
        },
        {
            id: "ORD-2024-002",
            date: "Nov 12, 2024",
            status: "Processing",
            total: 30.00,
            items: ["Bonsai Ficus"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuQ1GGR9x_WTdo-L0S5BynKVM9VNi2KLnWCv4u1BHbfC0ie4CsUb1AH_2sDOTV1EIOAyydQTq86WSJXuVqYbuIctNrkOoDPfqY4-2WVg-VcVGxkgXgLhCeSe8AOSMdCpdWYBwJDeS9tU9OxFtysrT5GG8kDBiTbp9WeJrIwpzQIw9DsA28HoOQo78lMm95heiSA-aLd_HzAeO8wCyPlJKyYrXEE-tXalpUWPPAj2mSTuWxxzkmW5tkBvw7RQdWDU6lyq_4RCuJpbGA"
        }
    ];

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
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Orders</h1>
            </div>

            <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex gap-4">
                            <div className="size-20 bg-gray-100 rounded-xl bg-center bg-cover shrink-0" style={{ backgroundImage: `url(${order.image})` }}></div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{order.id}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{order.items.join(", ")}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs text-slate-400">{order.date}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
