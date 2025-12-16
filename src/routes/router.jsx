import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";

import Mainlayoutp from "./../Layouts/MainLayout/MainLayoutp";

import Home from "./../Pages/Home";
import DonationRequests from "./../Pages/DonationRequests";
import Search from "./../Pages/Search";
import Login from "./../Pages/Login";
import Register from "./../Pages/Register";
import Users from "./../Pages/Users";

import DashboardLayout from "../Pages/DashboardLayout"; // ✅ rename/import correctly
import PrivateRoute1 from "./PrivateRoute1"; // ✅ use the same name you imported

// If these exist, import them too:
import DashboardHome from "./../Pages/DashboardHome";
import Profile from "./../Pages/Profile";
import Funding from "./../Pages/Funding";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayoutp />,
    children: [
      { index: true, element: <Home /> },
      { path: "donation-requests", element: <DonationRequests /> },
      { path: "search", element: <Search /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "users", element: <Users /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute1>
        <DashboardLayout />
      </PrivateRoute1>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "funding", element: <Funding /> },
    ],
  },
]);

export default router;

// In your main.jsx / index.jsx you'd use:
// <RouterProvider router={router} />
