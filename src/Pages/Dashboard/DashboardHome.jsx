import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { usersApi } from "../../api/users.api";
import StatsCards from "../../Components/DashBoards/StatsCards";

const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role || "donor"; // admin | volunteer | donor

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(role !== "donor");

  useEffect(() => {
    const run = async () => {
      if (role === "admin" || role === "volunteer") {
        setLoading(true);
        try {
          const res = await usersApi.getAdminStats();
          setStats(res);
        } catch (e) {
          console.error(e);
          setStats(null);
        } finally {
          setLoading(false);
        }
      }
    };
    run();
  }, [role]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.displayName || "User"} 👋
        </h1>
        <p className="opacity-70 mt-1">
          {role === "donor"
            ? "Check your donation requests and manage your profile."
            : "Quick overview of platform statistics."}
        </p>
      </div>

      {(role === "admin" || role === "volunteer") && (
        loading ? (
          <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6 flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span className="opacity-70">Loading stats...</span>
          </div>
        ) : (
          <StatsCards stats={stats} />
        )
      )}
    </div>
  );
};

export default DashboardHome;
