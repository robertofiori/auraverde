import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, displayName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        try {
            await sendEmailVerification(user);
        } catch (error) {
            console.error("Error sending verification email:", error);
            // Non-blocking error, proceed with flow
        }

        // Create user document in Firestore with default role 'customer' and empty favorites
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: displayName || "",
            role: 'customer',
            favorites: [],
            createdAt: new Date().toISOString()
        });

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    // Toggle Favorite Function
    async function toggleFavorite(productId) {
        if (!currentUser) return; // Should handle auth requirement in UI

        const userRef = doc(db, "users", currentUser.uid);
        const currentFavorites = userData?.favorites || [];

        let newFavorites;
        if (currentFavorites.includes(productId)) {
            newFavorites = currentFavorites.filter(id => id !== productId);
        } else {
            newFavorites = [...currentFavorites, productId];
        }

        try {
            await setDoc(userRef, { favorites: newFavorites }, { merge: true });
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            // No seteamos loading(true) aquí para evitar desmontar toda la app en cada cambio de auth

            // Unsubscribe from previous listener if it exists
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (user) {
                // Real-time listener for user document
                const userDocRef = doc(db, "users", user.uid);

                // Set up the snapshot listener
                unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserRole(data.role);
                        setUserData(data);
                    } else {
                        setUserRole('customer');
                        setUserData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
            } else {
                setUserRole(null);
                setUserData(null);
                setLoading(false);
            }
        });

        // Clean up both auth and snapshot listeners on component unmount
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        };
    }, []);

    const value = {
        currentUser,
        userRole,
        userData,
        toggleFavorite,
        signin: login,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
