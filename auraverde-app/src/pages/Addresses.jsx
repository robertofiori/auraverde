import { useState } from 'react';
import Header from '../components/Header';
import { useAddresses } from '../hooks/useAddresses';
import { useNavigate } from 'react-router-dom';

export default function Addresses() {
    const { addresses, addAddress, deleteAddress, loading } = useAddresses();
    const [isAdding, setIsAdding] = useState(false);
    // Simple form state
    const [formData, setFormData] = useState({
        alias: '', // e.g. "Casa", "Oficina"
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAddress(formData);
            setIsAdding(false);
            setFormData({ alias: '', firstName: '', lastName: '', address: '', city: '', zip: '' });
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Mobile Header */}
            <div className="md:hidden">
                <Header title="Mis Direcciones" showSearch={false} />
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-4 p-6 border-b border-gray-100 dark:border-white/5 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={() => navigate('/profile')} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Direcciones</h1>
            </div>

            <div className="p-4 md:p-8 max-w-2xl mx-auto w-full flex flex-col gap-6">

                {loading && (
                    <div className="flex justify-center p-8">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    </div>
                )}

                {/* List Addresses */}
                {!loading && addresses.map(addr => (
                    <div key={addr.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-2 relative group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{addr.alias}</h3>
                            </div>
                            <button onClick={() => deleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        <div className="pl-8 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            <p className="font-medium text-slate-700 dark:text-slate-300">{addr.firstName} {addr.lastName}</p>
                            <p>{addr.address}</p>
                            <p>{addr.city}, {addr.zip}</p>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {!loading && addresses.length === 0 && !isAdding && (
                    <div className="text-center py-12 opacity-60">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-2">map</span>
                        <p>No tienes direcciones guardadas.</p>
                    </div>
                )}

                {/* Add Form */}
                {isAdding ? (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-primary/20 animate-fade-in-up">
                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Nueva Dirección</h3>
                        <div className="flex flex-col gap-4">
                            <input name="alias" value={formData.alias} onChange={handleInputChange} required placeholder="Nombre (ej. Casa, Trabajo)" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />

                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="Nombre" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                                <input name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Apellido" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            </div>

                            <input name="address" value={formData.address} onChange={handleInputChange} required placeholder="Calle y número" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />

                            <div className="grid grid-cols-2 gap-4">
                                <input name="city" value={formData.city} onChange={handleInputChange} required placeholder="Ciudad" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                                <input name="zip" value={formData.zip} onChange={handleInputChange} required placeholder="Código Postal" className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white" />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-medium hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all">Guardar</button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all">
                        <span className="material-symbols-outlined">add_location_alt</span>
                        Agregar Nueva Dirección
                    </button>
                )}
            </div>
        </div>
    );
}
