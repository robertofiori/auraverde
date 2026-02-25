import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useAddresses() {
    const { currentUser } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Addresses
    useEffect(() => {
        if (!currentUser) {
            setAddresses([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Subcollection: users/{uid}/addresses
        const q = query(collection(db, "users", currentUser.uid, "addresses"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAddresses(docs);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Add Address
    const addAddress = async (addressData) => {
        if (!currentUser) throw new Error("Debes iniciar sesión");
        try {
            await addDoc(collection(db, "users", currentUser.uid, "addresses"), addressData);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    // Delete Address
    const deleteAddress = async (id) => {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "addresses", id));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { addresses, addAddress, deleteAddress, loading, error };
}
