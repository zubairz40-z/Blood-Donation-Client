import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";

const Mainlayoutp = () => {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Mainlayoutp;
