import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from './../Pages/Home';


import Register from './../Pages/Register';

import Mainlayoutp from './../Layouts/MainLayout/MainLayoutp';
import DonationRequests from './../Pages/DonationRequests';
import Search from './../Pages/Search';
import Login from './../Pages/Login';

import Dashboard from './../Pages/Dashboard';

import PrivateRoute1 from './PrivateRoute1';


const router = createBrowserRouter([
  {
    path: "/",
     element: <Mainlayoutp />,
    children:[
        {
            path:"",
            element:<Home></Home>
        },
        {
            path:"/donation-requests",
            element:<DonationRequests></DonationRequests>
        },
        {
             path:"/search",
            element:<Search></Search>

        },
        {
            path:"/login",
            element:<Login></Login>
        },
        {
            path:"/Register",
            element:<Register></Register>
        },{
  path: "/dashboard",
  element: (
    <PrivateRoute1>
      <Dashboard />
    </PrivateRoute1>
  ),
}
 
    ]

    
  },
]);

export default router;