import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import useUserRole from "../../Hooks/useUserRole";
import { donationRequestsApi } from "../../api/donationRequests.api";
import { usersApi } from "../../api/users.api";
import { toast } from "react-hot-toast";

import DonationRequestsTable from "../../Components/DashBoards/DonationRequestsTable";
import StatsCards from "../../Components/DashBoards/StatsCards";
import ConfirmModal from "../../Components/DashBoards/ConfirmModal";
import DashBoardImage from "../../assets/dashboardhome.jpg";

const DashboardHome = () => {
  const { dbUser, role, roleLoading } = useUserRole();
  const displayName = dbUser?.name || "User";

  // Donor: recent
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // Admin/Volunteer: stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Delete modal target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const roleLabel = useMemo(() => {
    if (role === "admin") return "Admin";
    if (role === "volunteer") return "Volunteer";
    return "Donor";
  }, [role]);

  const isAdminOrVolunteer = role === "admin" || role === "volunteer";

  /* ---------------- Donor recent requests ---------------- */
  useEffect(() => {
    if (roleLoading) return;

    const loadRecent = async () => {
      if (role !== "donor") {
        setRecent([]);
        return;
      }

      setRecentLoading(true);
      try {
        const res = await donationRequestsApi.getMyRecent();
        setRecent(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error(e);
        setRecent([]);
        toast.error(e?.message || "Failed to load recent requests");
      } finally {
        setRecentLoading(false);
      }
    };

    loadRecent();
  }, [role, roleLoading]);

  /* ---------------- Admin/Volunteer stats ---------------- */
  useEffect(() => {
    if (roleLoading) return;

    const loadStats = async () => {
      if (!isAdminOrVolunteer) {
        setStats(null);
        return;
      }

      setStatsLoading(true);
      try {
        const res = await usersApi.getAdminStats();
        setStats(res || null);
      } catch (e) {
        console.error(e);
        setStats(null);

        // show real server message if possible
        const msg = e?.message || e?.response?.data?.message || "Failed to load stats";
        toast.error(msg);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [isAdminOrVolunteer, roleLoading]);

  /* ---------------- Donor status update ---------------- */
  const onSetStatus = async (id, nextStatus) => {
    try {
      await toast.promise(donationRequestsApi.updateStatusDonor(id, nextStatus), {
        loading: "Updating status...",
        success: "Status updated ✅",
        error: (e) => e?.message || "Failed to update status",
      });

      const res = await donationRequestsApi.getMyRecent();
      setRecent(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------------- Donor delete ---------------- */
  const onConfirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await toast.promise(donationRequestsApi.deleteRequestDonor(deleteTarget._id), {
        loading: "Deleting request...",
        success: "Request deleted ✅",
        error: (e) => e?.message || "Failed to delete request",
      });

      setDeleteTarget(null);

      const res = await donationRequestsApi.getMyRecent();
      setRecent(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    }
  };

  if (roleLoading) {
    return (
      <div className="p-6 flex items-center gap-3">
        <span className="loading loading-spinner loading-md" />
        <span className="opacity-70">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-base-300/60 shadow-sm">
        <div className="absolute inset-0">
          <img
            src={DashBoardImage}
            alt="Dashboard banner"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/95 via-base-100/75 to-base-100/25" />
        </div>

        <div className="relative p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary">
            Welcome, {displayName} 👋
          </h1>
          <p className="opacity-80 mt-2">
            You are logged in as <b className="capitalize">{roleLabel}</b>.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/dashboard/profile" className="btn btn-secondary rounded-2xl">
              View Profile
            </Link>

            {role === "donor" && (
              <>
                <Link
                  to="/dashboard/create-donation-request"
                  className="btn btn-outline rounded-2xl"
                >
                  Create Request
                </Link>
                <Link to="/dashboard/my-donation-requests" className="btn btn-ghost rounded-2xl">
                  My Requests
                </Link>
              </>
            )}

            {isAdminOrVolunteer && (
              <Link
                to="/dashboard/all-blood-donation-request"
                className="btn btn-outline rounded-2xl"
              >
                Manage Requests
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Admin / Volunteer stats */}
      {isAdminOrVolunteer && (
        <div className="rounded-3xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-bold">Statistics Overview</h2>
            {statsLoading ? (
              <span className="text-sm opacity-70 flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Loading...
              </span>
            ) : null}
          </div>

          <div className="mt-4">
            {statsLoading ? (
              <div className="space-y-3">
                <div className="skeleton h-20 w-full rounded-2xl" />
                <div className="skeleton h-20 w-full rounded-2xl" />
              </div>
            ) : stats ? (
              <StatsCards stats={stats} />
            ) : (
              <div className="rounded-2xl border border-base-300/60 bg-base-200/30 p-6 text-center">
                <p className="font-semibold">Stats unavailable</p>
                <p className="text-sm opacity-70 mt-1">
                  If you are not admin/volunteer, set your role in MongoDB and login again.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donor recent requests */}
      {role === "donor" && (
        <div className="rounded-3xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-bold">My Recent Donation Requests</h2>

            <Link to="/dashboard/my-donation-requests" className="btn btn-sm btn-secondary rounded-xl">
              View my all request
            </Link>
          </div>

          {recentLoading ? (
            <div className="mt-4 flex items-center gap-3">
              <span className="loading loading-spinner loading-md" />
              <span className="opacity-70">Loading recent requests...</span>
            </div>
          ) : recent.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-base-300/60 bg-base-200/30 p-6 text-center">
              <p className="font-bold">No requests yet</p>
              <p className="text-sm opacity-70 mt-1">Create your first request to get started.</p>
              <Link to="/dashboard/create-donation-request" className="btn btn-secondary rounded-2xl mt-4">
                Create Donation Request
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <DonationRequestsTable
                rows={recent}
                mode="donor"
                onStatus={onSetStatus}
                onDelete={setDeleteTarget}
                onEditRoute="/dashboard/edit-donation-request"
              />
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete donation request?"
        message={`This will permanently delete the request for ${deleteTarget?.recipientName || ""}.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default DashboardHome;
