import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc")); // or orderBy name
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          firestoreId: doc.id // Always unique
        }));
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    async function fetchProduct() {
      try {
        // Estrategia 1: Buscar por campo 'id' (que es lo que usamos en las URLs)
        // Intentamos como número y como string por si acaso
        const numericId = parseInt(id);
        const idToSearch = !isNaN(numericId) ? numericId : id;

        // Búsqueda por query (cuando el ID de la URL es el campo 'id' del documento)
        const q = query(collection(db, "products"), where("id", "==", idToSearch));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setProduct({ id: docSnap.data().id, ...docSnap.data(), firestoreId: docSnap.id });
        } else {
            // Estrategia 2: Fallback - Buscar por Document ID (si la URL fuera el ID de Firestore directamente)
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
                setError("Producto no encontrado");
            }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
