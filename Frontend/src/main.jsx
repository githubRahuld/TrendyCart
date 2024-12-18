import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OtpVerification from "./pages/OtpVerification.jsx";
import Cart from "./pages/Cart.jsx";
import ProductsByCateg from "./components/ProductsByCateg.jsx";
import Checkout from "./pages/Checkout.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/verifyOtp",
        element: <OtpVerification />,
      },
      {
        path: "/auth/sign-up",
        element: <Signup />,
      },
      {
        path: "/users/home",
        element: <Home />,
      },
      {
        path: "/product/:productId",
        element: <ProductPage />,
      },
      {
        path: "/category/:category",
        element: <ProductsByCateg />,
      },
      {
        path: "/users/cart",
        element: <ProtectedRoute element={<Cart />} />,
      },
      {
        path: "/users/checkout",
        element: <ProtectedRoute element={<Checkout />} />,
      },
      {
        path: "/users/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NextUIProvider>
      <main>
        <RouterProvider router={router} />
      </main>
    </NextUIProvider>
  </Provider>
);
