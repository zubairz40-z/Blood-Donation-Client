import React from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { FiTarget, FiTrendingUp, FiShield } from "react-icons/fi";

const values = [
  { icon: <FiTarget className="text-xl" />, title: "Mission", desc: "Faster donor access" },
  { icon: <FiShield className="text-xl" />, title: "Trust", desc: "Verified information" },
  { icon: <FiTrendingUp className="text-xl" />, title: "Impact", desc: "Community growth" },
];

const timeline = [
  { title: "We identified the problem", desc: "Donors were hard to find during urgent situations.", dot: "bg-secondary" },
  { title: "Built donor search", desc: "Filter by blood group, district, and upazila.", dot: "bg-secondary/80" },
  { title: "Added request tracking", desc: "Pending → In Progress → Done with clear actions.", dot: "bg-secondary/70" },
  { title: "Growing with partners", desc: "Support organizations and funding options to increase impact.", dot: "bg-secondary/60" },
];

const AboutHistorySection = () => {
  const ease = [0.22, 1, 0.36, 1];

  const leftWrap = {
    hidden: { x: -110, opacity: 0, scale: 0.98, filter: "blur(7px)" },
    show: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  };

  const rightWrap = {
    hidden: { x: 110, opacity: 0, scale: 0.98, filter: "blur(7px)" },
    show: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <motion.div
            variants={leftWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease }}
            className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_45%)] opacity-30" />

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1600&auto=format&fit=crop"
                alt="Blood donation mission"
                className="h-72 w-full object-cover sm:h-96"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              <p className="text-sm font-semibold tracking-wide text-secondary">About Us</p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A mission to make donation faster and simpler
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                We built this platform to reduce the time it takes to find the right blood group in the right
                location. Our focus is a smooth experience: verified donor profiles, organized requests,
                and clear status tracking.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="group rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/10">
                      {v.icon}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{v.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            variants={rightWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="min-w-0"
          >
            <p className="text-sm font-semibold tracking-wide text-secondary">Our journey</p>

            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              How we got here
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              A story-based timeline that shows progress and purpose — different from “How it works”.
            </p>

            {/* ✅ NEW TIMELINE (dot never overlaps text) */}
            <div className="relative mt-8">
              {/* vertical line */}
              <span className="absolute left-[12px] top-0 h-full w-[2px] bg-secondary/25" />

              <div className="space-y-7">
                {timeline.map((t, idx) => (
                  <div key={idx} className="grid grid-cols-[28px_1fr] gap-x-4">
                    {/* dot column */}
                    <div className="relative">
                      <span
                        className={`absolute left-[5px] top-[6px] h-4 w-4 rounded-full ${t.dot} ring-4 ring-slate-50`}
                      />
                    </div>

                    {/* text column */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 break-words">
                        {t.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 break-words">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="p-6">
                <p className="text-sm font-semibold text-slate-900">
                  “A small donation can save a life.”
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Join the community and help someone in need — quickly and safely.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <NavLink
                    to="/dashboard/become-donor"
                    className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-secondary/20 transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Become a Donor
                  </NavLink>

                  <NavLink
                    to="/search"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Search Donors
                  </NavLink>
                </div>
              </div>

              <div className="h-[3px] w-full bg-gradient-to-r from-secondary/70 via-secondary/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistorySection;
