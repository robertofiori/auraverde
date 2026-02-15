import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const PUBLIC_KEY = 'TEST-00000000-0000-0000-0000-000000000000'; // Replace with YOUR Public Key

export default function MercadoPagoCheckout({ orderId, total }) {
    const [preferenceId, setPreferenceId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize with Public Key
        initMercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
    }, []);

    const createPreference = async () => {
        setIsLoading(true);
        try {
            // SIMULACIÓN DE BACKEND:
            console.log("Simulating backend call for Order:", orderId);

            // MOCK DELAY (Simula tiempo de red)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular respuesta exitosa
            // En un caso real, obtendríamos un preferenceId del backend.
            // Aquí redirigimos directamente a nuestra página de éxito simulada.

            alert("Modo Simulación: Redirigiendo a página de éxito...");

            // Redirigir a la página de éxito interna
            // Nota: En producción real, esto sería window.location.href = data.init_point (URL de MercadoPago)
            window.location.href = `/auraverde/success?collection_status=approved&external_reference=${orderId}&payment_type=simulated`;

        } catch (error) {
            console.error(error);
            alert("Error en la simulación.");
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
