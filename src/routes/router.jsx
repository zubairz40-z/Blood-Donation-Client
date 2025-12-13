import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from './../Pages/Home';


import Register from './../Pages/Register';

import Mainlayoutp from './../Layouts/MainLayout/MainLayoutp';
import DonationRequests from './../Pages/DonationRequests';
import Search from './../Pages/Search';
import Login from './../Pages/Login';


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
        }
    ]

    
  },
]);

export default router;