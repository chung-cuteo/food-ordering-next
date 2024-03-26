"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

export function AppContext({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  const localStore =
    typeof window !== "undefined" ? window.localStorage : "Not suported";

  useEffect(() => {
    if (localStore && localStore.getItem("cart")) {
      setCartProducts(JSON.parse(localStore.getItem("cart")));
    }
  }, []);

  const saveCartProductsToLocalStorage = (cartProducts) => {
    if (localStore) {
      localStore.setItem("cart", JSON.stringify(cartProducts));
    }
  };

  const clearCart = () => {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  };

  const removeCartProduct = (index) => {
    setCartProducts((prev) => {
      const newCartProducts = prev.filter((cart, idx) => idx !== index);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success("removed from cart");
  };

  const addToCart = (product, sizes = null, extras = []) => {
    setCartProducts((prev) => {
      const cartProduct = { ...product, sizes, extras };
      const newProducts = [...prev, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("added to cart");
  };

  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          clearCart,
          removeCartProduct,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
