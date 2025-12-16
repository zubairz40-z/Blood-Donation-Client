import React, { useMemo } from "react";
import { NavLink, Outlet } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { FiHome, FiUser, FiDollarSign, FiLogOut, FiArrowLeft, FiMenu } from "react-icons/fi";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();

  const navItems = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard Home", icon: <FiHome />, end: true },
      { to: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
      { to: "/dashboard/funding", label: "Funding", icon: <FiDollarSign /> },
      { to: "/", label: "Back to Home", icon: <FiArrowLeft /> },
    ],
    []
  );

  const linkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
      "hover:bg-base-100/70 hover:shadow-sm",
      isActive ? "bg-base-100 shadow-sm text-secondary" : "text-base-content/80",
    ].join(" ");

  const avatarLetter = (user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase();
  const photoURL = user?.photoURL || user?.photoUrl || user?.avatar;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Content */}
        <div className="drawer-content">
          {/* ✅ No navbar on top */}
          {/* Mobile floating button to open sidebar */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-secondary btn-circle fixed left-4 bottom-4 z-30 lg:hidden shadow-lg"
            aria-label="Open dashboard menu"
          >
            <FiMenu size={20} />
          </label>

          <main className="p-4 lg:p-6 w-full">
            {/* ✅ Full-width (no max-w container) */}
            <div className="rounded-2xl bg-base-100/70 backdrop-blur border border-base-300/60 shadow-sm">
              <div className="p-4 lg:p-6">
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay" />

          <aside className="w-80 min-h-full bg-base-200/70 backdrop-blur border-r border-base-300/60">
            <div className="p-5">
              {/* Profile card */}
              <div className="rounded-2xl bg-base-100/70 border border-base-300/60 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-base-300/60 bg-base-100 shadow-sm">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={user?.displayName || "User"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center bg-secondary/15 text-secondary font-bold text-lg">
                        {avatarLetter}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-base-content truncate">
                      {user?.displayName || "Welcome back"}
                    </h2>
                    <p className="text-xs opacity-70 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="px-2 text-xs font-semibold tracking-wide opacity-60">NAVIGATION</p>
                <nav className="mt-2 space-y-1">
                  {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-secondary opacity-0 group-[.active]:opacity-100" />
                      <span className="text-lg opacity-90">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="mt-6">
                <button onClick={logOut} className="btn btn-error w-full rounded-xl" type="button">
                  <FiLogOut />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
