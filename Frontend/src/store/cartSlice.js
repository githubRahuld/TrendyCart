import { createSlice } from "@reduxjs/toolkit";

// Load cart state from localStorage or initialize with an empty array
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add a product to the cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if the product exists
      } else {
        state.push({ ...product, quantity: 1 }); // Add new product to the cart
      }

      // Sync cart with localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    // Remove a product from the cart
    removeFromCart: (state, action) => {
      const updatedCart = state.filter((item) => item.id !== action.payload);

      // Sync updated cart with localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    },
    // Clear the entire cart
    clearCart: () => {
      localStorage.removeItem("cart");
      return [];
    },
    // Update product quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      // Sync updated cart with localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
