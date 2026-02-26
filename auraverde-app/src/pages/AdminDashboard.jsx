import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, addDoc, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { userRole, currentUser } = useAuth();
    const { orders, loading: loadingOrders, updateOrderStatus } = useAdminOrders();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('inventory'); // inventory, sales, orders
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [image2File, setImage2File] = useState(null);
    const [image2Preview, setImage2Preview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Form State for Inventory
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: '',
        image: '',
        image2: '',
        description: '',
        stock: 0,
        costPrice: '',
        isNew: false,
        badge: 'none', // none, nuevo, oferta
        potPequeña: '',
        potMediana: '',
        potGrande: '',
        careLuz: '',
        careAgua: '',
        careTemp: '',
        potDefault: 'pequena' // pequena, mediana, grande
    });

    // Stats Calculation
    const stats = useMemo(() => {
        const totalSales = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        // Calculate Total Cost based on items in orders
        const totalCost = orders.reduce((acc, order) => {
            const orderCost = (order.items || []).reduce((itemAcc, item) => {
                // Use costPrice from item if available (historical), fallback to current product cost
                const itemCost = item.costPrice || 0;
                return itemAcc + (itemCost * (item.quantity || 1));
            }, 0);
            return acc + orderCost;
        }, 0);

        const netProfit = totalRevenue - totalCost;
        const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
        const lowStockProducts = products.filter(p => p.stock <= 5).length;

        return { totalSales, totalRevenue, totalCost, netProfit, pendingOrders, lowStockProducts };
    }, [orders, products]);

    // Fetch Products
    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            productsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        if (userRole === 'admin') {
            fetchProducts();
        }
    }, [userRole]);

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, "products", String(productId)));
            fetchProducts();
            setConfirmDeleteId(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al eliminar el producto");
        }
    };

    const calculateNextId = () => {
        if (products.length === 0) return 1;
        const ids = products.map(p => parseInt(p.id)).filter(n => !isNaN(n));
        return Math.max(...(ids.length > 0 ? ids : [0])) + 1;
    };

    const handleFileChange = (e, isSecond = false) => {
        const file = e.target.files[0];
        if (file) {
            if (isSecond) {
                setImage2File(file);
            } else {
                setImageFile(file);
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isSecond) {
                    setImage2Preview(reader.result);
                } else {
                    setImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();

        // If adding new, need at least one image. If editing, might keep old one.
        if (!editingId && !imageFile) {
            alert("Por favor, selecciona al menos una imagen");
            return;
        }

        setSubmitting(true);
        try {
            const apiUrl = 'https://us-central1-auraverde-db.cloudfunctions.net/uploadImage';
            let mainImageUrl = formData.image;
            let secondaryImageUrl = formData.image2;

            // 1. Upload Main Image if changed
            if (imageFile) {
                const base64 = await fileToBase64(imageFile);
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ base64Image: base64, fileName: imageFile.name, contentType: imageFile.type })
                });
                if (res.ok) {
                    const data = await res.json();
                    mainImageUrl = data.url;
                }
            }

            // 2. Upload Secondary Image if changed
            if (image2File) {
                const base64 = await fileToBase64(image2File);
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ base64Image: base64, fileName: image2File.name, contentType: image2File.type })
                });
                if (res.ok) {
                    const data = await res.json();
                    secondaryImageUrl = data.url;
                }
            }

            // 3. Save to Firestore
            const productData = {
                ...formData,
                image: mainImageUrl,
                image2: secondaryImageUrl,
                price: parseFloat(formData.price),
                costPrice: parseFloat(formData.costPrice || 0),
                stock: parseInt(formData.stock),
                badge: formData.badge || 'none',
                potPequeña: formData.potPequeña || '',
                potMediana: formData.potMediana || '',
                potGrande: formData.potGrande || '',
                careLuz: formData.careLuz || '',
                careAgua: formData.careAgua || '',
                careTemp: formData.careTemp || '',
                potDefault: formData.potDefault || 'pequena',
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await updateDoc(doc(db, "products", String(editingId)), productData);
            } else {
                const nextId = calculateNextId();
                const newProduct = { ...productData, id: nextId, createdAt: new Date().toISOString() };
                await setDoc(doc(db, "products", String(nextId)), newProduct);
            }

            // 4. Reset
            resetForm();
            fetchProducts();
            alert(editingId ? "Producto actualizado" : "Producto creado");
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error al guardar");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', price: '', type: '', image: '', image2: '', description: '', stock: 0, costPrice: '', isNew: false, badge: 'none',
            potPequeña: '', potMediana: '', potGrande: '', careLuz: '', careAgua: '', careTemp: '', potDefault: 'pequena'
        });
        setImageFile(null);
        setImagePreview(null);
        setImage2File(null);
        setImage2Preview(null);
        setEditingId(null);
    };

    const startEditing = (p) => {
        setEditingId(p.id);
        setFormData({
            name: p.name || '',
            price: p.price || '',
            type: p.type || '',
            image: p.image || '',
            image2: p.image2 || '',
            description: p.description || '',
            stock: p.stock || 0,
            costPrice: p.costPrice || '',
            isNew: p.isNew || false,
            badge: p.badge || 'none',
            potPequeña: p.potPequeña || '',
            potMediana: p.potMediana || '',
            potGrande: p.potGrande || '',
            careLuz: p.careLuz || '',
            careAgua: p.careAgua || '',
            careTemp: p.careTemp || '',
            potDefault: p.potDefault || 'pequena'
        });
        setImagePreview(p.image || null);
        setImage2Preview(p.image2 || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateStock = async (productId, newStock) => {
        try {
            await updateDoc(doc(db, "products", String(productId)), { stock: parseInt(newStock) });
            setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    if (!currentUser || userRole !== 'admin') {
        return <div className="p-10 text-center">Acceso denegado</div>;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Panel Maestro</h1>
                <p className="text-slate-500 dark:text-gray-400">Control total de Auraverde</p>
            </header>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Ventas Totales</p>
                    <p className="text-2xl font-black text-primary">{stats.totalSales}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Rentabilidad Final</p>
                    <p className={`text-2xl font-black ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        ${stats.netProfit.toFixed(0)}
                    </p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pedidos Pendientes</p>
                    <p className="text-2xl font-black text-amber-500">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Bajo Stock</p>
                    <p className="text-2xl font-black text-red-500">{stats.lowStockProducts}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-px overflow-x-auto">
                {['inventory', 'orders', 'sales'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-bold text-sm transition-all rounded-t-xl ${activeTab === tab ? 'bg-primary text-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {tab === 'inventory' ? 'Inventario' : tab === 'orders' ? 'Pedidos' : 'Ventas y Ganancias'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'inventory' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Save Product Form */}
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{editingId ? 'Editar Producto' : 'Añadir Producto'}</h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-xs font-bold text-red-500 uppercase">Cancelar</button>
                                )}
                            </div>
                            <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
                                <input required placeholder="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="number" placeholder="Precio Venta ($)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" />
                                    <input required type="number" placeholder="Costo ($)" value={formData.costPrice} onChange={e => setFormData({ ...formData, costPrice: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" />
                                </div>
                                <input required type="number" placeholder="Stock Inicial" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" />
                                <input required placeholder="Tipo (Ej. Interior)" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" />

                                {/* Images Upload */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Image 1 */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto Principal</label>
                                        <div className="flex items-center gap-3">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} className="hidden" id="img-1" />
                                            <label htmlFor="img-1" className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                <span className="material-symbols-outlined text-slate-400">add_a_photo</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[100px]">{imageFile ? imageFile.name : 'Subir 1'}</span>
                                            </label>
                                            {imagePreview && (
                                                <div className="size-10 rounded-lg bg-cover bg-center border border-gray-100 dark:border-white/10" style={{ backgroundImage: `url(${imagePreview})` }}></div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Image 2 */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto Secundaria</label>
                                        <div className="flex items-center gap-3">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="hidden" id="img-2" />
                                            <label htmlFor="img-2" className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                <span className="material-symbols-outlined text-slate-400">add_a_photo</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[100px]">{image2File ? image2File.name : 'Subir 2'}</span>
                                            </label>
                                            {image2Preview && (
                                                <div className="size-10 rounded-lg bg-cover bg-center border border-gray-100 dark:border-white/10" style={{ backgroundImage: `url(${image2Preview})` }}></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Badge Selection */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Etiqueta Especial</label>
                                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                        {[
                                            { id: 'none', label: 'Ninguna', color: 'text-slate-500 hover:bg-gray-200 dark:hover:bg-white/10' },
                                            { id: 'nuevo', label: 'Nuevo', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30' },
                                            { id: 'oferta', label: 'Oferta', color: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/30' }
                                        ].map(badge => (
                                            <button
                                                key={badge.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, badge: badge.id })}
                                                className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border-2
                                                    ${formData.badge === badge.id
                                                        ? 'bg-white dark:bg-black border-primary scale-[1.02] shadow-sm z-10'
                                                        : 'border-transparent opacity-60 hover:opacity-100'}
                                                    ${badge.id !== 'none' && formData.badge === badge.id ? badge.color : ''}
                                                `}
                                            >
                                                {badge.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Details Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    {/* Pot Sizes */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamaños de Maceta</label>
                                        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                            {[
                                                { id: 'pequena', label: 'Pequeña' },
                                                { id: 'mediana', label: 'Mediana' },
                                                { id: 'grande', label: 'Grande' }
                                            ].map(size => (
                                                <button
                                                    key={size.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, potDefault: size.id })}
                                                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border-2
                                                        ${formData.potDefault === size.id
                                                            ? 'bg-white dark:bg-black border-primary scale-[1.02] shadow-sm z-10'
                                                            : 'border-transparent opacity-60 hover:opacity-100'}
                                                    `}
                                                >
                                                    {size.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Care Instructions */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuidados (Texto personalizado)</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-amber-500 text-sm">wb_sunny</span>
                                                <input placeholder="Luz (Ej. Indirecta)" value={formData.careLuz} onChange={e => setFormData({ ...formData, careLuz: e.target.value })} className="flex-1 p-2 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-500 text-sm">water_drop</span>
                                                <input placeholder="Agua (Ej. Semanal)" value={formData.careAgua} onChange={e => setFormData({ ...formData, careAgua: e.target.value })} className="flex-1 p-2 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-red-500 text-sm">thermostat</span>
                                                <input placeholder="Temp (Ej. 18-25°C)" value={formData.careTemp} onChange={e => setFormData({ ...formData, careTemp: e.target.value })} className="flex-1 p-2 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <textarea placeholder="Descripción" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-black dark:border-gray-800" rows="3" />
                                <button disabled={submitting} className="w-full bg-primary py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 text-black hover:bg-emerald-500 transition-colors">
                                    {submitting ? 'Guardando...' : editingId ? 'Actualizar Producto' : 'Guardar Producto'}
                                </button>
                            </form>
                        </div>

                        {/* Inventory List */}
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                            <h2 className="text-xl font-bold mb-4">Stock Actual</h2>
                            <div className="overflow-y-auto max-h-[500px] flex flex-col gap-3 pr-2 custom-scrollbar">
                                {products.map(p => (
                                    <div key={p.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                        <div className="size-12 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${p.image})` }}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate text-sm">#{p.id} {p.name}</p>
                                            <p className="text-xs text-slate-500">PVP: ${p.price} | Costo: ${p.costPrice || 0}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-slate-400">Stock:</p>
                                            <input
                                                type="number"
                                                className="w-16 p-1 text-center bg-white dark:bg-black border rounded-lg text-sm font-bold"
                                                value={p.stock || 0}
                                                onChange={(e) => handleUpdateStock(p.id, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {confirmDeleteId === p.id ? (
                                                <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 p-1 rounded-xl border border-red-100 dark:border-red-900/30">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteProduct(p.id)}
                                                        className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        Borrar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase rounded-lg"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditing(p)}
                                                        className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(p.id)}
                                                        className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 overflow-x-auto">
                        <h2 className="text-xl font-bold mb-6">Gestión de Pedidos</h2>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 uppercase border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-4 font-black">Pedido ID</th>
                                    <th className="pb-4 font-black">Cliente</th>
                                    <th className="pb-4 font-black">Total</th>
                                    <th className="pb-4 font-black">Estado</th>
                                    <th className="pb-4 font-black">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-50 dark:border-white/5">
                                        <td className="py-4 font-mono text-xs">#{order.id.slice(-6)}</td>
                                        <td className="py-4">
                                            <p className="font-bold">{order.userEmail}</p>
                                            <p className="text-xs text-slate-500">{order.dateStr}</p>
                                        </td>
                                        <td className="py-4 font-black text-primary">${order.total?.toFixed(2)}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                                ${order.status === 'Entregado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    order.status === 'Despachado' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        order.status === 'Pendiente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'
                                                }
                                            `}>
                                                {order.status || 'Procesando'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <select
                                                className="bg-gray-100 dark:bg-black border-none rounded-lg p-1 text-xs font-bold focus:ring-2 ring-primary transition-all"
                                                value={order.status || 'Procesando'}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="Procesando">Procesando</option>
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Despachado">Despachado</option>
                                                <option value="Entregado">Entregado</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'sales' && (
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <h2 className="text-xl font-bold mb-6">Informes de Venta</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl text-black">
                                <p className="text-sm font-bold opacity-80">Bruto Total</p>
                                <p className="text-4xl font-black">${stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-2xl">
                                <p className="text-sm font-bold text-slate-500">Promedio por Pedido</p>
                                <p className="text-4xl font-black">${(stats.totalRevenue / (stats.totalSales || 1)).toFixed(2)}</p>
                            </div>
                            <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-2xl">
                                <p className="text-sm font-bold text-slate-500">Crecimiento</p>
                                <p className="text-4xl font-black text-primary">+{stats.totalSales}</p>
                                <p className="text-xs text-slate-400">Pedidos capturados</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
