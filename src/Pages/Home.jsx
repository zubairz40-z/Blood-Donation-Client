import React from "react";
import Banner from "../Components/Shared/Banner/Banner";
import FeaturedSection from "../Components/FeaturedSection/FeaturedSection";
import ContactSection from "../Components/ContactSection/ContactSection";
import AboutHistorySection from "../Components/AboutHistorySection/AboutHistorySection";

const Home =()=>{
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
