import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

const StatItem = ({
  label,
  to,
  suffix = "",
  duration = 1.2,
  delay = 0,
  start,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const controls = animate(0, to, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [start, to, duration, delay]);

  const display = Math.round(value).toLocaleString();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <h4 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {display}
        {suffix}
      </h4>

      <p className="mt-1.5 text-xs font-semibold tracking-wide text-secondary sm:text-sm">
        {label}
      </p>
    </div>
  );
};

const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35, once: true });

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-secondary via-secondary/40 to-transparent" />

      {/* subtle hover glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
        <StatItem
          start={inView}
          label="Blood Cooperations"
          to={75}
          suffix="+"
          duration={1.05}
        />
        <StatItem
          start={inView}
          label="Volunteer & Staff"
          to={145}
          suffix="+"
          duration={1.15}
          delay={0.08}
        />
        <StatItem
          start={inView}
          label="Donations Enabled"
          to={320}
          suffix="K+"
          duration={1.25}
          delay={0.16}
        />
      </div>

      {/* Mobile */}
      <div className="sm:hidden divide-y divide-slate-200">
        <StatItem
          start={inView}
          label="Blood Cooperations"
          to={75}
          suffix="+"
          duration={1.05}
        />
        <StatItem
          start={inView}
          label="Volunteer & Staff"
          to={145}
          suffix="+"
          duration={1.15}
          delay={0.08}
        />
        <StatItem
          start={inView}
          label="Donations Enabled"
          to={320}
          suffix="K+"
          duration={1.25}
          delay={0.16}
        />
      </div>
    </div>
  );
};

export default StatsBar;
