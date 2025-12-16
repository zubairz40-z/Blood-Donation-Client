import { createBrowserRouter } from "react-router";
import Mainlayoutp from "../Layouts/MainLayout/MainLayoutp";

// Public pages
import Home from "../Pages/Home";
import Search from "../Pages/Search";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Users from "../Pages/Users";
import DonationRequests from "../Pages/DonationRequests";
import DonationRequestDetails from "../Pages/DonationRequestDetail";

// Dashboard pages
import DashboardLayout from "../Pages/Dashboard/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Profile from "../Pages/Dashboard/Profile";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/Dashboard/CreateDonationRequest";
import AllUsers from "../Pages/Dashboard/AllUsers";
import AllBloodDonationRequests from "../Pages/Dashboard/AllBloodDonationRequests";
import Funding from "../Pages/Dashboard/Funding";

// Guards
import PrivateRoute1 from "./PrivateRoute1";
import RoleRoute from "./RoleRoute";

import ErrorPage from "../Pages/ErrorPage";
import NotFound from "../Pages/NotFound";

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

      // ✅ shared for all roles
      { path: "profile", element: <Profile /> },

      // ✅ donor + admin
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

      // ✅ admin only
      {
        path: "all-users",
        element: (
          <RoleRoute allow={["admin"]}>
            <AllUsers />
          </RoleRoute>
        ),
      },

      // ✅ admin + volunteer
      {
        path: "all-blood-donation-request",
        element: (
          <RoleRoute allow={["admin", "volunteer"]}>
            <AllBloodDonationRequests />
          </RoleRoute>
        ),
      },

      // ✅ funding is PRIVATE (all logged-in users can view; you can restrict later)
      {
        path: "funding",
        element: (
          <RoleRoute allow={["donor", "admin", "volunteer"]}>
            <Funding />
          </RoleRoute>
        ),
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
