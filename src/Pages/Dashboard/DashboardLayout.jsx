import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useUserRole from "../../Hooks/useUserRole";
import { toast } from "react-hot-toast";
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
  FiRefreshCcw,
  FiAlertTriangle,
} from "react-icons/fi";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { dbUser, role, roleLoading } = useUserRole();
  const navigate = useNavigate();

  const displayName = dbUser?.name || user?.displayName || "User";
  const email = user?.email || "";
  const photoURL = dbUser?.avatar || user?.photoURL || "";
  const avatarLetter = (displayName?.[0] || email?.[0] || "U").toUpperCase();

  const [imgOk, setImgOk] = useState(true);

  // ✅ prevent infinite loading UI
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  useEffect(() => {
    if (!roleLoading) {
      setLoadingTooLong(false);
      return;
    }
    const t = setTimeout(() => setLoadingTooLong(true), 12000); // 12s
    return () => clearTimeout(t);
  }, [roleLoading]);

  const token = localStorage.getItem("access-token");

  const linkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
      "hover:bg-base-100/70 hover:shadow-sm",
      isActive ? "bg-base-100 shadow-sm text-secondary" : "text-base-content/80",
    ].join(" ");

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
      { to: "/dashboard/funding", label: "Funding", icon: FiDollarSign },
    ];

    const admin = [
      { to: "/dashboard/all-users", label: "All Users", icon: FiUsers },
      { to: "/dashboard/all-blood-donation-request", label: "All Blood Requests", icon: FiDroplet },
      { to: "/dashboard/funding", label: "Funding", icon: FiDollarSign },
    ];

    const volunteer = [
      { to: "/dashboard/all-blood-donation-request", label: "All Blood Requests", icon: FiDroplet },
      { to: "/dashboard/funding", label: "Funding", icon: FiDollarSign },
    ];

    const footer = [{ to: "/", label: "Back to Home", icon: FiArrowLeft }];

    if (role === "admin") return [...common, ...admin, ...footer];
    if (role === "volunteer") return [...common, ...volunteer, ...footer];
    return [...common, ...donor, ...footer];
  }, [role]);

  const handleLogout = async () => {
    const t = toast.loading("Logging out...");
    try {
      await logOut();
      toast.success("Logged out", { id: t });
      navigate("/login");
    } catch (e) {
      toast.error(e?.message || "Logout failed", { id: t });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ If role loading and not too long, show spinner
  if (roleLoading && !loadingTooLong) {
    return (
      <div className="min-h-screen grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // ✅ If token missing, show message (prevents silent infinite loading)
  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6 text-center max-w-md w-full">
          <div className="flex items-center justify-center gap-2 text-warning">
            <FiAlertTriangle />
            <p className="font-semibold">Session token missing</p>
          </div>
          <p className="opacity-70 text-sm mt-2">
            Firebase login is OK, but your server JWT is missing. Please login again.
          </p>

          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            <button className="btn btn-primary rounded-xl" onClick={() => navigate("/login")}>
              Go to Login
            </button>
            <button className="btn btn-ghost rounded-xl" onClick={handleRefresh}>
              <FiRefreshCcw /> Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If loading took too long OR role missing, show error UI instead of infinite spinner
  if (loadingTooLong || !role) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6 text-center max-w-md w-full">
          <div className="flex items-center justify-center gap-2 text-error">
            <FiAlertTriangle />
            <p className="font-semibold">Dashboard failed to load</p>
          </div>

          <p className="opacity-70 text-sm mt-2">
            Could not load your user role from the database. Most common reasons:
            <br />• <span className="font-medium">/users/me</span> returns 401 (token issue)
            <br />• user not saved in MongoDB (POST /users missing)
            <br />• CORS blocked request
          </p>

          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            <button className="btn btn-secondary rounded-xl" onClick={handleRefresh}>
              <FiRefreshCcw /> Refresh
            </button>
            <button className="btn btn-error rounded-xl" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Content */}
        <div className="drawer-content">
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
                    {photoURL && imgOk ? (
                      <img
                        src={photoURL}
                        alt={displayName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImgOk(false)}
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center bg-secondary/15 text-secondary font-bold text-lg">
                        {avatarLetter}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-base-content truncate">{displayName}</h2>
                    <p className="text-xs opacity-70 truncate">{email}</p>

                    <div className="mt-2">
                      <span className="badge badge-secondary badge-outline capitalize">{role}</span>

                      {dbUser?.status && (
                        <span
                          className={`badge ml-2 capitalize ${
                            dbUser.status === "blocked" ? "badge-error" : "badge-success"
                          }`}
                        >
                          {dbUser.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="mt-6">
                <p className="px-2 text-xs font-semibold tracking-wide opacity-60">NAVIGATION</p>

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
                <button onClick={handleLogout} className="btn btn-error w-full rounded-xl" type="button">
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
