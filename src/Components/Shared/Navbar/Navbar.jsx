import React from "react";
import { NavLink } from "react-router";
import Logo from "./../../Logo/Logo";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition duration-200";
const linkInactive =
  "text-slate-700 hover:text-secondary hover:bg-secondary/10";
const linkActive = "text-secondary bg-secondary/10";

const desktopLinkClass = ({ isActive }) =>
  `relative ${linkBase} ${isActive ? linkActive : linkInactive}
   after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-[2px]
   after:rounded-full after:transition
   ${isActive ? "after:bg-secondary" : "after:bg-transparent"}`;

const mobileLinkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? linkActive : linkInactive}`;

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="navbar-start">
          {/* Mobile menu */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
            >
              {[
                { to: "/", label: "Home" },
                { to: "/donation-requests", label: "Donation Requests" },
                { to: "/search", label: "Search" },
                { to: "/funding", label: "Funding" },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={mobileLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="mt-2 border-t border-slate-200 pt-2">
                <NavLink to="/login" className={mobileLinkClass}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={mobileLinkClass}>
                  Register
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-secondary">
              <Logo />
            </span>
          </NavLink>
        </div>

        {/* CENTER (Desktop links) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            {[
              { to: "/donation-requests", label: "Donation Requests" },
              { to: "/funding", label: "Funding" },
              { to: "/search", label: "Search" },
            ].map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={desktopLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT buttons */}
        <div className="navbar-end gap-2">
          <NavLink
            to="/login"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-secondary/20 transition hover:opacity-90 active:scale-[0.98]"
          >
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
