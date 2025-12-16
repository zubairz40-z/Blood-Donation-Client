import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useDBUser from "../../../Hooks/useDBUser";
import Logo from "../../Logo/Logo";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { dbUser, dbUserLoading } = useDBUser();
  const navigate = useNavigate();

  const [imgOk, setImgOk] = useState(true);

  const handleLogout = async () => {
    await logOut();
    localStorage.removeItem("access-token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition
     ${isActive ? "bg-secondary text-secondary-content" : "hover:bg-base-200/70"}`;

  // ✅ MongoDB is source of truth
  const displayName = dbUser?.name || "User";
  const email = user?.email || "";
  const avatar = dbUser?.avatar || ""; // ✅ only db avatar
  const avatarLetter = (displayName?.[0] || email?.[0] || "U").toUpperCase();

  // Always visible links
  const commonLinks = (
    <>
      <li>
        <NavLink to="/donation-requests" className={linkClass}>
          Donation Requests
        </NavLink>
      </li>

      <li>
        <NavLink to="/search" className={linkClass}>
          Search Donors
        </NavLink>
      </li>
    </>
  );

  // Only when logged in
  const authLinks = user ? (
    <li>
      <NavLink to="/dashboard/funding" className={linkClass}>
        Funding
      </NavLink>
    </li>
  ) : null;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="navbar min-h-[68px] p-0">
            {/* Left */}
            <div className="navbar-start gap-2">
              {/* Mobile menu */}
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle lg:hidden"
                  aria-label="Open menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] w-60 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
                >
                  {commonLinks}
                  {authLinks}
                  <div className="divider my-1" />

                  {!user ? (
                    <>
                      <li>
                        <Link to="/login" className="px-4 py-2 rounded-xl hover:bg-base-200/70">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="px-4 py-2 rounded-xl font-semibold bg-secondary text-secondary-content hover:opacity-90"
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/dashboard" className="px-4 py-2 rounded-xl hover:bg-base-200/70">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 rounded-xl text-error hover:bg-base-200/70"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Brand */}
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>

            {/* Center (desktop nav) */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 gap-2">
                {commonLinks}
                {authLinks}
              </ul>
            </div>

            {/* Right */}
            <div className="navbar-end gap-2">
              {!user ? (
                <>
                  <Link to="/login" className="btn btn-ghost rounded-full">
                    Login
                  </Link>

                  <Link to="/register" className="btn btn-secondary border-0 rounded-full px-6">
                    Register
                  </Link>
                </>
              ) : (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost rounded-full px-2 flex items-center gap-3"
                  >
                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-10 rounded-full ring ring-secondary/40 ring-offset-base-100 ring-offset-2 overflow-hidden">
                        {avatar && imgOk ? (
                          <img
                            src={avatar}
                            alt={displayName}
                            referrerPolicy="no-referrer"
                            onError={() => setImgOk(false)}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center bg-secondary/15 text-secondary font-bold">
                            {avatarLetter}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name beside avatar */}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold leading-4">
                        {dbUserLoading ? "Loading..." : displayName}
                      </p>
                      <p className="text-xs text-base-content/60 leading-4">{email}</p>
                    </div>
                  </label>

                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] mt-3 w-56 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
                  >
                    <li>
                      <Link to="/dashboard" className="rounded-xl">
                        Dashboard
                      </Link>
                    </li>

                    <div className="divider my-1" />

                    <li>
                      <button
                        onClick={handleLogout}
                        className="rounded-xl text-error hover:bg-base-200/70"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
