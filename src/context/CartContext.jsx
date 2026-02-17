import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Track previous total to only toast when crossing the threshold to 5
  const prevTotalRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Safe side effect handling
    const currentTotal = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Check if we just hit 5 (and weren't at 5 before)
    // Also avoid toasting on initial load if user already has 5 items (optional, but good UX)
    // Assuming "prevTotalRef.current < 5" ensures we crossed into it.
    if (currentTotal === 5 && prevTotalRef.current < 5 && prevTotalRef.current !== 0) {
      showToast("Elegiste 5 productos!! Tu envio ahora es GRATIS!!", "success", 4000);
    } else if (currentTotal === 5 && prevTotalRef.current === 0) {
      // If loaded with 5 items, maybe don't show? Or show?
      // Let's decide to NOT show on clear page load to avoid spam, 
      // but if user had 4 and refresh/adds... wait.
      // For now, let's require crossing the threshold from <5.
      // User request: "cuando el usuario este dentro del catalogo y eliga 5 productos" -> implies action.
    }

    prevTotalRef.current = currentTotal;
  }, [cartItems, showToast]);

  const addToCart = (product) => {
    setCartItems(prev => {
      let newItems;
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prev, { ...product, quantity: 1 }];
      }

      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      const newItems = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      return newItems;
    });
  };

  const clearCart = () => setCartItems([]);

  const [shippingCost, setShippingCost] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const total = subtotal + tax + shippingCost;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      tax,
      shippingCost,
      setShippingCost,
      selectedAddress,
      setSelectedAddress,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
