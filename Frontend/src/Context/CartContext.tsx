import { createContext, useContext, useState, type ReactNode } from "react";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
   updateQuantity: (productId: number, newQuantity: number) => void; // ✅ added
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  

  // Add item (increase quantity if exists)
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
   const updateQuantity = (productId: number, newQuantity: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: newQuantity > 0 ? newQuantity : 1 }
          : p
      )
    );
  };


  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart , updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
