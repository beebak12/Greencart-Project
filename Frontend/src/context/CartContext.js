import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('greencart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('greencart_auth');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  // User info state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('greencart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('greencart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('greencart_auth', JSON.stringify(isAuthenticated));
    localStorage.setItem('greencart_user', JSON.stringify(user));
  }, [isAuthenticated, user]);

  // Login function
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Optional: Clear cart on logout
    // setCartItems([]);
  };

  // Add item to cart (with authentication check)
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prevItems, { 
          ...product, 
          quantity,
          cartId: Date.now() + Math.random() // Unique ID for cart management
        }];
      }
    });
  };

  // Remove item from cart completely
  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  // Update item quantity
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart subtotal
  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart total (with shipping, tax, etc.)
  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const tax = subtotal * 0.13; // 13% tax
    return subtotal + shipping + tax;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    // Cart related
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartSubtotal,
    getCartTotal,
    isInCart,
    getItemQuantity,
    
    // Authentication related
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};