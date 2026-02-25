import { useState } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { products } from '../data/products';

export default function Migration() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [log, setLog] = useState([]);

    async function migrateProducts() {
        setStatus('loading');
        setLog(prev => [...prev, 'Iniciando migración...']);

        try {
            let count = 0;
            for (const product of products) {
                // Usamos el ID del producto como ID del documento para mantener URLs
                await setDoc(doc(db, "products", String(product.id)), {
                    ...product,
                    price: Number(product.price), // Asegurar formato numérico
                    createdAt: new Date().toISOString()
                });
                setLog(prev => [...prev, `✅ Producto migrado: ${product.name}`]);
                count++;
            }
            setStatus('success');
            setLog(prev => [...prev, `✨ ¡Éxito! ${count} productos subidos a Firestore.`]);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setLog(prev => [...prev, `❌ Error: ${error.message}`]);
        }
    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Migración de Base de Datos</h1>

            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg w-full max-w-2xl border border-slate-200 dark:border-slate-800">
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                    Este script leerá los {products.length} productos del archivo local y los subirá a tu base de datos Firestore.
                </p>

                <button
                    onClick={migrateProducts}
                    disabled={status === 'loading' || status === 'success'}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all
            ${status === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {status === 'loading' ? 'Migrando...' : status === 'success' ? '¡Migración Completada!' : 'Iniciar Migración'}
                </button>

                <div className="mt-6 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                    {log.map((entry, i) => (
                        <div key={i} className="mb-1 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1 last:border-0">
                            {entry}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
