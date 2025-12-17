import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/router";
import "./index.css";
import AuthProvider from "./Providers/AuthProvider";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  // ✅ StrictMode runs effects twice in dev and can cause JWT/token race + loading loops
  // <React.StrictMode>
  <AuthProvider>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
  </AuthProvider>
  // </React.StrictMode>
);

