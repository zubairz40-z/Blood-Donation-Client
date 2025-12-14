import React from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import BannerImage from "../../../assets/healthcare-concept-clinic.jpg";
import PartnerSwiper from "../../PartnerSwiper/PartnerSwiper";

const Banner = () => {
  const ease = [0.22, 1, 0.36, 1];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <img
        src={BannerImage}
        alt="Blood donation banner"
        className="absolute inset-0 h-full w-full object-cover scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.10),transparent_55%)]" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        {/* ✅ FeaturedSection-like motion */}
        <motion.div
          initial={{ x: 110, opacity: 0, scale: 0.98, filter: "blur(7px)" }}
          whileInView={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease }}
          className="w-full max-w-2xl rounded-2xl bg-white/10 p-6 backdrop-blur-xl shadow-2xl ring-1 ring-white/15 sm:p-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 ring-1 ring-white/15">
            🩸 Blood Donation Platform
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Donate Blood, <span className="text-white/90">Save Lives</span>
          </h1>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/80 sm:text-base">
            Connect donors with people who urgently need blood. Join as a donor or
            search donors by blood group and location.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/25 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.98]"
            >
              Join as a Donor
            </NavLink>

            <NavLink
              to="/search"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.98]"
            >
              Search Donors
            </NavLink>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Fast Requests
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Verified Profiles
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Location-based Search
            </span>
          </div>
        </motion.div>
      </div>

      {/* Partner Section */}
      <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white/95 sm:text-xl">
            Partner Support
          </h2>
          <span className="h-px flex-1 bg-white/20" />
        </div>

        <PartnerSwiper />
      </div>
    </section>
  );
};

export default Banner;
