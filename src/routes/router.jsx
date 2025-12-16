import { createBrowserRouter } from "react-router";
import Mainlayoutp from "../Layouts/MainLayout/MainLayoutp";

// Public pages
import Home from "../Pages/Home";
import Search from "../Pages/Search";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Users from "../Pages/Users";
import DonationRequests from "../Pages/DonationRequests";


// Dashboard pages
import DashboardLayout from "../Pages/Dashboard/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Profile from "../Pages/Dashboard/Profile";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/Dashboard/CreateDonationRequest";
import AllUsers from "../Pages/Dashboard/AllUsers";
import AllBloodDonationRequests from "../Pages/Dashboard/AllBloodDonationRequests";

// Guards
import PrivateRoute1 from "./PrivateRoute1";

// Optional
import ErrorPage from "../Pages/ErrorPage";
import NotFound from "../Pages/NotFound";
import DonationRequestDetails from "./../Pages/DonationRequestDetail";

import RoleRoute from "./RoleRoute";
import Funding from './../Pages/Dashboard/Funding';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayoutp />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Public
      { path: "donation-requests", element: <DonationRequests /> },
      { path: "search", element: <Search /> },
      { path: "funding", element: <Funding /> }, // ✅ ADD THIS ROUTE
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "users", element: <Users /> },

      // ✅ Private details
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute1>
            <DonationRequestDetails />
          </PrivateRoute1>
        ),
      },
    ],
  },

  // ✅ Dashboard (Private)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute1>
        <DashboardLayout />
      </PrivateRoute1>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome /> },

      // ✅ shared
      { path: "profile", element: <Profile /> },

      // ✅ Donor pages (donor + admin)
      {
        path: "my-donation-requests",
        element: (
          <RoleRoute allow={["donor", "admin"]}>
            <MyDonationRequests />
          </RoleRoute>
        ),
      },

      {
        path: "create-donation-request",
        element: (
          <RoleRoute allow={["donor", "admin"]}>
            <CreateDonationRequest />
          </RoleRoute>
        ),
      },

      // ✅ Admin only
      {
        path: "all-users",
        element: (
          <RoleRoute allow={["admin"]}>
            <AllUsers />
          </RoleRoute>
        ),
      },

      // ✅ Admin + Volunteer
      {
        path: "all-blood-donation-request",
        element: (
          <RoleRoute allow={["admin", "volunteer"]}>
            <AllBloodDonationRequests />
          </RoleRoute>
        ),
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
