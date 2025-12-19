import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
    const { userRole, currentUser } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: '',
        image: '',
        description: '',
        isNew: false
    });

    // Protect Route
    useEffect(() => {
        if (!loading && (!currentUser || userRole !== 'admin')) {
            // Optional: Redirect to home or login if not admin
            // For now showing message in render
        }
    }, [currentUser, userRole, loading]);

    // Fetch Products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by ID numeric if possible
            productsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (docId) => {
        if (!window.confirm("¿Estás seguro de borrar este producto?")) return;
        try {
            await deleteDoc(doc(db, "products", docId));
            fetchProducts(); // Refresh
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al borrar");
        }
    };

    const calculateNextId = () => {
        if (products.length === 0) return 1;
        const ids = products.map(p => parseInt(p.id)).filter(n => !isNaN(n));
        if (ids.length === 0) return 1;
        return Math.max(...ids) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const nextId = calculateNextId();
            const newProduct = {
                ...formData,
                id: nextId,
                price: parseFloat(formData.price),
                createdAt: new Date().toISOString()
            };

            // Set document ID manually to match the friendly numeric ID
            await setDoc(doc(db, "products", String(nextId)), newProduct);

            alert(`✅ Producto creado con ID: ${nextId}`);
            setFormData({ name: '', price: '', type: '', image: '', description: '', isNew: false }); // Reset
            fetchProducts();
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Error al crear el producto");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    if (!currentUser || userRole !== 'admin') {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Acceso Restringido</h1>
                <p className="mb-2">Solo los administradores pueden ver esta página.</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg inline-block text-left text-sm font-mono text-black dark:text-white">
                    <p><strong>Tu UID:</strong> {currentUser?.uid || 'No logueado'}</p>
                    <p><strong>Tu Rol actual:</strong> {userRole || 'Ninguno'}</p>
                    <p><strong>Email:</strong> {currentUser?.email || '-'}</p>
                </div>
                <div className="mt-6 flex flex-col gap-2 justify-center items-center">
                    <p className="text-sm text-gray-500">Si cambiaste el rol en Firebase, recarga:</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Recargar Página
                    </button>
                    <p className="text-xs text-gray-400 mt-2">O prueba cerrar sesión para limpiar caché:</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 bg-gray-50 dark:bg-black">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Panel de Administración</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ADD PRODUCT FORM */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">add_circle</span> Nuevo Producto
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Nombre</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black dark:border-gray-700" placeholder="Ej. Monstera" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Precio ($)</label>
                                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black dark:border-gray-700" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Tipo</label>
                                <input required name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black dark:border-gray-700" placeholder="Ej. Interior" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">URL Imagen</label>
                            <input required name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black dark:border-gray-700" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Descripción</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black dark:border-gray-700" rows="3" placeholder="Descripción del producto..." />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} id="isNew" className="w-5 h-5 accent-primary" />
                            <label htmlFor="isNew" className="cursor-pointer">Marcar como "Nuevo"</label>
                        </div>

                        <button type="submit" disabled={submitting} className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors">
                            {submitting ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </form>
                </div>

                {/* LIST PRODUCTS */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">inventory_2</span> Inventario ({products.length})
                    </h2>
                    <div className="overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {products.map(p => (
                            <div key={p.id} className="flex items-center gap-4 p-3 mb-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-gray-200" />
                                <div className="flex-1">
                                    <div className="font-bold">#{p.id} - {p.name}</div>
                                    <div className="text-sm text-gray-500">${p.price} | {p.type}</div>
                                </div>
                                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Borrar">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
