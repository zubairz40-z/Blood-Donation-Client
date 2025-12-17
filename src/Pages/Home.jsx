import React, { useEffect } from "react";
import Banner from "../Components/Shared/Banner/Banner";
import FeaturedSection from "../Components/FeaturedSection/FeaturedSection";
import ContactSection from "../Components/ContactSection/ContactSection";
import AboutHistorySection from "../Components/AboutHistorySection/AboutHistorySection";

const Home =()=>{

//       useEffect(() => {
//     fetch("http://localhost:5000/")
//       .then((res) => res.text())
//       .then((data) => console.log("SERVER:", data))
//       .catch((err) => console.log("ERROR:", err));
//   }, []);
    return(
       <div>
        <Banner></Banner>

        <FeaturedSection></FeaturedSection>

        <AboutHistorySection></AboutHistorySection>
        <ContactSection></ContactSection>
       </div>

    )
}

export default Home;
