import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const PUBLIC_KEY = 'APP_USR-ba40ce42-cf76-493a-89e2-d548df4447d4'; // Replace with YOUR Public Key

export default function MercadoPagoCheckout({ orderId, total, items, shippingCost }) {
    const [preferenceId, setPreferenceId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize with Public Key
        initMercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
    }, []);

    const createPreference = async () => {
        setIsLoading(true);
        try {
            // Prepare items array
            const mpItems = items.map(item => ({
                id: item.id,
                title: item.name,
                currency_id: 'ARS',
                picture_url: item.image,
                description: item.name,
                category_id: 'gardening',
                quantity: item.quantity,
                unit_price: Number(item.price)
            }));

            // Add Shipping as an item if cost > 0
            if (shippingCost > 0) {
                mpItems.push({
                    id: 'shipping',
                    title: 'Envío',
                    currency_id: 'ARS',
                    description: 'Costo de envío',
                    quantity: 1,
                    unit_price: Number(shippingCost)
                });
            }

            const apiUrl = import.meta.env.DEV
                ? 'http://127.0.0.1:5001/auraverde-db/us-central1/createPreference'
                : 'https://us-central1-auraverde-db.cloudfunctions.net/createPreference';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: mpItems,
                    orderId: orderId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { id } = await response.json();
            setPreferenceId(id);
        } catch (error) {
            console.error("Error creating preference:", error);
            alert("Error al inicializar el pago. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {!preferenceId ? (
                <button
                    onClick={createPreference}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#009EE3] hover:bg-[#008ED6] text-white font-bold rounded-xl shadow-lg shadow-blue-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            Pagar con <span className="font-extrabold">Mercado Pago</span>
                        </>
                    )}
                </button>
            ) : (
                <Wallet initialization={{ preferenceId: preferenceId }} />
            )}

            <p className="text-xs text-center text-gray-400 mt-2">
                <span className="material-symbols-outlined text-[10px] align-middle mr-1">lock</span>
                Pagos procesados de forma segura por Mercado Pago
            </p>
        </div>
    );
}
