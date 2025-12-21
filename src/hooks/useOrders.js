import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useOrders() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create Order
    const createOrder = async (orderData) => {
        if (!currentUser) throw new Error("Debes iniciar sesión para comprar");
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "orders"), {
                ...orderData,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                createdAt: serverTimestamp(),
                status: 'Processing', // Processing, Shipped, Delivered
                paymentStatus: 'pending' // pending, paid
            });
            return docRef.id;
        } catch (err) {
            console.error("Error creating order:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Real-time Orders Listener
    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Query orders for current user
        // Note: We sort in client-side to avoid needing a composite index immediately
        const q = query(
            collection(db, "orders"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Helper date string
                    dateStr: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : "Reciente"
                };
            });

            // Client-side sort by date descending (newest first)
            ordersData.sort((a, b) => {
                const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
                const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
                return dateB - dateA;
            });

            setOrders(ordersData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching orders:", err);
            setError("No se pudieron cargar los pedidos");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { orders, createOrder, loading, error };
}
