import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../services/cartService';

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number, maxStock: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCartItems: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      setLoading(true);
      try {
        const items = await getCart(userId);
        if (isMounted) setCart(items);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? (subtotal > 1500 ? 0 : 25) : 0;
  const total = subtotal + shippingFee;

  const addItem = async (product: Product, quantity = 1) => {
    const updated = await addToCart(userId, product, quantity);
    setCart(updated);
  };

  const updateQuantity = async (cartItemId: string, quantity: number, maxStock: number) => {
    const updated = await updateCartQuantity(userId, cartItemId, quantity, maxStock);
    setCart(updated);
  };

  const removeItem = async (cartItemId: string) => {
    const updated = await removeFromCart(userId, cartItemId);
    setCart(updated);
  };

  const clearCartItems = async () => {
    await clearCart(userId);
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        subtotal,
        shippingFee,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
