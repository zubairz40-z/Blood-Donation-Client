import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";

import Mainlayoutp from "./../Layouts/MainLayout/MainLayoutp";

import Home from "./../Pages/Home";
import DonationRequests from "./../Pages/DonationRequests";
import Search from "./../Pages/Search";
import Login from "./../Pages/Login";
import Register from "./../Pages/Register";
import Users from "./../Pages/Users";



import Profile from "./../Pages/Profile";

import DashboardLayout from './../Pages/DashboardLayout';
import PrivateRoute1 from './PrivateRoute1';
import DashboardHome from './../Pages/DashboardHome';

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
     
    ],
  },
]);

export default router;

// In your main.jsx / index.jsx you'd use:
// <RouterProvider router={router} />
