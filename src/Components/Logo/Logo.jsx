import React from "react";
import MainLogo from "../../assets/blood-drop.png"


const Logo =()=>{
 console.log(import.meta.env.VITE_FIREBASE_API_KEY);

    return(
        <div className="flex items-end">
            <img src={MainLogo} alt="" className="h-10 w-auto"/>

            <h3 className="text-3xl text-secondary font-bold ms-0.5">LifeDrop</h3>
           
        </div>


    )
}
export default Logo;