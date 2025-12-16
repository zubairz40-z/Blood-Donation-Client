import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useUserRole from "../../Hooks/useUserRole";
import { donationRequestsApi } from "../../api/donationRequests.api";
import { usersApi } from "../../api/users.api";

const DashboardHome = () => {
  const { dbUser, role, roleLoading } = useUserRole();

  const displayName = dbUser?.name || "User";

  // donor recent 3
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // admin/volunteer stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Donor: recent requests
  useEffect(() => {
    if (roleLoading) return;

    const run = async () => {
      if (role === "donor") {
        setRecentLoading(true);
        try {
          const res = await donationRequestsApi.getMyRecent();
          setRecent(Array.isArray(res) ? res : []);
        } catch (e) {
          console.error(e);
          setRecent([]);
        } finally {
          setRecentLoading(false);
        }
      } else {
        setRecent([]);
      }
    };

    run();
  }, [role, roleLoading]);

  // Admin/Volunteer: stats
  useEffect(() => {
    if (roleLoading) return;

    const run = async () => {
      if (role === "admin" || role === "volunteer") {
        setStatsLoading(true);
        try {
          const res = await usersApi.getAdminStats();
          setStats(res);
        } catch (e) {
          console.error(e);
          setStats(null);
        } finally {
          setStatsLoading(false);
        }
      } else {
        setStats(null);
      }
    };

    run();
  }, [role, roleLoading]);

  const onSetStatus = async (id, nextStatus) => {
    try {
      await donationRequestsApi.updateStatusDonor(id, nextStatus);
      const res = await donationRequestsApi.getMyRecent();
      setRecent(Array.isArray(res) ? res : []);
    } catch (e) {
      alert(e.message);
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
      {/* Welcome */}
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold">
          Welcome, {displayName} 👋
        </h1>
        <p className="opacity-70 mt-1 capitalize">
          You are logged in as <b>{role}</b>.
        </p>
      </div>

      {/* Admin/Volunteer */}
      {(role === "admin" || role === "volunteer") && (
        <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
          <h2 className="text-lg font-bold mb-3">Statistics Overview</h2>

          {statsLoading ? (
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-md" />
              <span className="opacity-70">Loading stats...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
                <p className="text-xs opacity-60 font-semibold">TOTAL USERS</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
              </div>

              <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
                <p className="text-xs opacity-60 font-semibold">TOTAL FUNDING</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalFunding || 0}</p>
              </div>

              <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
                <p className="text-xs opacity-60 font-semibold">TOTAL REQUESTS</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalRequests || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donor recent */}
      {role === "donor" && recent.length > 0 && (
        <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-bold">My Recent Donation Requests</h2>

            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-sm btn-secondary rounded-xl"
            >
              View my all request
            </Link>
          </div>

          {recentLoading ? (
            <div className="mt-4 flex items-center gap-3">
              <span className="loading loading-spinner loading-md" />
              <span className="opacity-70">Loading recent requests...</span>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Blood</th>
                    <th>Status</th>
                    <th>Donor Info</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recent.map((r) => (
                    <tr key={r._id}>
                      <td className="font-medium">{r.recipientName}</td>
                      <td className="opacity-80">
                        {r.recipientDistrict}, {r.recipientUpazila}
                      </td>
                      <td>{r.donationDate}</td>
                      <td>{r.donationTime}</td>
                      <td>
                        <span className="badge badge-outline font-semibold">
                          {r.bloodGroup}
                        </span>
                      </td>
                      <td>
                        <span className="badge capitalize">{r.status}</span>
                      </td>
                      <td className="text-sm">
                        {r.status === "inprogress" ? (
                          <div>
                            <p className="font-medium">{r.donorName}</p>
                            <p className="opacity-70">{r.donorEmail}</p>
                          </div>
                        ) : (
                          <span className="opacity-60">—</span>
                        )}
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <Link
                            to={`/donation-requests/${r._id}`}
                            className="btn btn-xs btn-outline rounded-lg"
                          >
                            View
                          </Link>

                          {r.status === "inprogress" && (
                            <>
                              <button
                                className="btn btn-xs btn-success rounded-lg"
                                onClick={() => onSetStatus(r._id, "done")}
                              >
                                Done
                              </button>
                              <button
                                className="btn btn-xs btn-error rounded-lg"
                                onClick={() => onSetStatus(r._id, "canceled")}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
