import { NavLink, Outlet } from "react-router";
import useAuth from "../Hooks/useAuth";
import { FiHome, FiUser, FiDollarSign, FiLogOut, FiArrowLeft, FiMenu } from "react-icons/fi";
import React from "react";


const DashboardLayout = () => {
  const { user, logOut } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "btn btn-secondary btn-sm justify-start w-full"
      : "btn btn-ghost btn-sm justify-start w-full";

  return (
    <div className="drawer lg:drawer-open">
      {/* Toggle (mobile) */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Top bar (mobile only) */}
        <div className="navbar bg-base-100 border-b lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
              <FiMenu size={20} />
            </label>
          </div>
          <div className="flex-1">
            <span className="font-bold text-secondary">Dashboard</span>
          </div>
        </div>

        <main className="p-4 bg-base-100 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-base-200 p-4">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-secondary">Dashboard</h2>
            <p className="text-xs opacity-70 break-all">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <NavLink to="/dashboard" className={linkClass} end>
              <FiHome /> <span className="ml-2">Dashboard Home</span>
            </NavLink>

            <NavLink to="/dashboard/profile" className={linkClass}>
              <FiUser /> <span className="ml-2">Profile</span>
            </NavLink>

            <NavLink to="/dashboard/funding" className={linkClass}>
              <FiDollarSign /> <span className="ml-2">Funding</span>
            </NavLink>

            <NavLink to="/" className={linkClass}>
              <FiArrowLeft /> <span className="ml-2">Back to Home</span>
            </NavLink>

            <button
              onClick={logOut}
              className="btn btn-error btn-sm w-full justify-start"
              type="button"
            >
              <FiLogOut /> <span className="ml-2">Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
