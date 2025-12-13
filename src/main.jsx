import { createRoot } from 'react-dom/client';
import router from './routes/router';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";

createRoot(document.getElementById('root')).render(


     
       
           <RouterProvider router={router} />
             

   
 
 

)
