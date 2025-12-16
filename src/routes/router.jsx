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

// Dashboard (private) pages
import DashboardLayout from "../Pages/Dashboard/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Profile from "../Pages/Dashboard/Profile";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/Dashboard/CreateDonationRequest";
import AllUsers from "../Pages/Dashboard/AllUsers";

import DonationRequestsPublic from './../Pages/Dashboard/DonationRequestsPublic';
import AllBloodDonationRequests from './../Pages/Dashboard/AllBLoodDonationRequests';

// Guards
import PrivateRoute1 from "./PrivateRoute1";

// Optional
import ErrorPage from "../Pages/ErrorPage";
import NotFound from "../Pages/NotFound";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayoutp />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      // Public
      { path: "donation-requests", element: <DonationRequestsPublic /> },
      { path: "search", element: <Search /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "users", element: <Users /> },

      // Private details
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

      // shared
      { path: "profile", element: <Profile /> },

      // donor
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },

      // admin / volunteer
      { path: "all-users", element: <AllUsers /> },
      { path: "all-blood-donation-request", element: <AllBloodDonationRequests /> },

      // later:
      // { path: "funding", element: <Funding /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
