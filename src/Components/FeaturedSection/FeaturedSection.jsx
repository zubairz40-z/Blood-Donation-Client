import React from "react";
import { FiPhoneCall, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import StatsBar from "../StatesBar/StatsBar";
import { NavLink } from 'react-router';

const FeaturedSection = () => {
  const leftVariant = {
    hidden: { x: -40, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  const rightVariant = {
    hidden: { x: 40, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* LEFT (slide from left) */}
          <motion.div
            variants={leftVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
          >
            <p className="text-sm font-semibold tracking-wide text-secondary">
              How our platform works
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dedicated to life — a smarter blood donation journey
            </h2>

            <p className="mt-4 max-w-prose text-sm leading-relaxed text-slate-600 sm:text-base">
              Our blood donation app connects donors and recipients with a clear, step-by-step process.
              Search donors by blood group and area, create urgent requests, and track donation status
              from <span className="font-semibold text-slate-900">Pending</span> to{" "}
              <span className="font-semibold text-slate-900">Done</span>.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Help card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h3 className="text-base font-bold text-slate-900">
                  Have a question?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Need help with registration, requests, or donations? Call our support line.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                    <FiPhoneCall className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Support Hotline</p>
                    <p className="font-semibold text-slate-900">+880 1XXXXXXXXX</p>
                  </div>
                </div>
              </div>

              {/* Steps card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h3 className="text-base font-bold text-slate-900">Quick steps</h3>

                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="mt-0.5 text-secondary" />
                    <span>Register as a donor with blood group and location.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="mt-0.5 text-secondary" />
                    <span>Search donors or browse pending donation requests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="mt-0.5 text-secondary" />
                    <span>
                      Confirm donation to move status to{" "}
                      <b className="text-slate-900">In Progress</b>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="mt-0.5 text-secondary" />
                    <span>
                      Complete the donation and mark as{" "}
                      <b className="text-slate-900">Done</b>.
                    </span>
                  </li>
                </ul>

            <NavLink
  to="/dashboard"
  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
>
  Discover more
</NavLink>
              </div>
            </div>
          </motion.div>

          {/* RIGHT (slide from right) */}
          <motion.div
            variants={rightVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
            className="space-y-6"
          >
            <StatsBar />

            <div className="rounded-2xl border border-white/10 bg-secondary p-6 text-white shadow-lg sm:p-8">
              <h3 className="text-2xl font-extrabold tracking-tight">
                Why we do it
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                Every day, patients need blood for accidents, surgeries, anemia, and emergency care.
                But finding the right blood group at the right time is still difficult. Our goal is to
                bridge that gap by making donor search and blood requests fast, organized, and reliable.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                <img
                  src="https://media.istockphoto.com/id/987110992/photo/red-blood-bag-in-hand-scientist-over-white-background-in-laboratory.jpg?s=612x612&w=0&k=20&c=8nN7F6JEHqL0LmTp8lsvzcA4Ekrvj8djbwpR81Sh9kc="
                  alt="Blood donation support"
                  className="h-60 w-full object-cover"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-white/80">Goal</p>
                  <p className="mt-1 font-semibold">Faster donor access</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-white/80">Focus</p>
                  <p className="mt-1 font-semibold">Safe & verified info</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
