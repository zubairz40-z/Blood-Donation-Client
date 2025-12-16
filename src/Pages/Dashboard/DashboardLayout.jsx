import React, { useMemo } from "react";
import { NavLink, Outlet } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useUserRole from "../../Hooks/useUserRole";
import {
  FiHome,
  FiUser,
  FiDollarSign,
  FiLogOut,
  FiArrowLeft,
  FiMenu,
  FiUsers,
  FiDroplet,
  FiPlusCircle,
} from "react-icons/fi";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { dbUser, role, roleLoading } = useUserRole();

  const linkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
      "hover:bg-base-100/70 hover:shadow-sm",
      isActive ? "bg-base-100 shadow-sm text-secondary" : "text-base-content/80",
    ].join(" ");

  // ✅ Prefer DB avatar (because profile updates go to DB)
  const photoURL = dbUser?.avatar || user?.photoURL || "";
  const avatarLetter = (dbUser?.name?.[0] || user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase();

  const closeDrawerMobile = () => {
    const el = document.getElementById("dashboard-drawer");
    if (el) el.checked = false;
  };

  const navItems = useMemo(() => {
    const common = [
      { to: "/dashboard", label: "Dashboard Home", icon: FiHome, end: true },
      { to: "/dashboard/profile", label: "Profile", icon: FiUser },
    ];

    const donor = [
      { to: "/dashboard/my-donation-requests", label: "My Donation Requests", icon: FiDroplet },
      { to: "/dashboard/create-donation-request", label: "Create Donation Request", icon: FiPlusCircle },
    ];

    const admin = [
      { to: "/dashboard/all-users", label: "All Users", icon: FiUsers },
      { to: "/dashboard/all-blood-donation-request", label: "All Blood Requests", icon: FiDroplet },
      { to: "/dashboard/funding", label: "Funding", icon: FiDollarSign },
    ];

    const volunteer = [
      { to: "/dashboard/all-blood-donation-request", label: "All Blood Requests", icon: FiDroplet },
    ];

    const footer = [{ to: "/", label: "Back to Home", icon: FiArrowLeft }];

    if (role === "admin") return [...common, ...admin, ...footer];
    if (role === "volunteer") return [...common, ...volunteer, ...footer];
    return [...common, ...donor, ...footer];
  }, [role]);

  if (roleLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Content */}
        <div className="drawer-content">
          {/* ✅ No top navbar */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-secondary btn-circle fixed left-4 bottom-4 z-30 lg:hidden shadow-lg"
            aria-label="Open dashboard menu"
          >
            <FiMenu size={20} />
          </label>

          <main className="p-4 lg:p-6 w-full">
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
                        alt={dbUser?.name || user?.displayName || "User"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // hide image if broken and show fallback
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* fallback always exists behind image */}
                    <div className="h-full w-full grid place-items-center bg-secondary/15 text-secondary font-bold text-lg">
                      {avatarLetter}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-base-content truncate">
                      {dbUser?.name || user?.displayName || "Welcome back"}
                    </h2>
                    <p className="text-xs opacity-70 truncate">{user?.email}</p>

                    <div className="mt-2">
                      <span className="badge badge-secondary badge-outline capitalize">
                        {role}
                      </span>
                      {dbUser?.status && (
                        <span className={`badge ml-2 capitalize ${dbUser.status === "blocked" ? "badge-error" : "badge-success"}`}>
                          {dbUser.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="mt-6">
                <p className="px-2 text-xs font-semibold tracking-wide opacity-60">
                  NAVIGATION
                </p>

                <nav className="mt-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={linkClass}
                        onClick={closeDrawerMobile}
                      >
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-secondary opacity-0 group-[.active]:opacity-100" />
                        <span className="text-lg opacity-90">
                          <Icon />
                        </span>
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Logout */}
              <div className="mt-6">
                <button
                  onClick={logOut}
                  className="btn btn-error w-full rounded-xl"
                  type="button"
                >
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
