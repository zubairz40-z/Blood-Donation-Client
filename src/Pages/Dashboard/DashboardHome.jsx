import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";

const statusBadge = (status) => {
  const base = "badge font-medium";
  if (status === "pending") return `${base} badge-warning`;
  if (status === "inprogress") return `${base} badge-info`;
  if (status === "done") return `${base} badge-success`;
  if (status === "canceled") return `${base} badge-error`;
  return `${base} badge-ghost`;
};

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ✅ Replace with your real API calls
  const fetchMyRecentRequests = async () => {
    // Example:
    // const res = await axiosSecure.get(`/donation-requests?email=${user.email}&limit=3&sort=desc`);
    // return res.data;
    return []; // demo empty
  };

  const updateStatus = async (id, nextStatus) => {
    // Example:
    // await axiosSecure.patch(`/donation-requests/${id}`, { status: nextStatus });
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: nextStatus } : r))
    );
  };

  const deleteRequest = async (id) => {
    // Example:
    // await axiosSecure.delete(`/donation-requests/${id}`);
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchMyRecentRequests();
        setRequests(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        console.error(e);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) run();
  }, [user?.email]);

  const hasRequests = useMemo(() => requests && requests.length > 0, [requests]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {user?.displayName || "User"} 👋
        </h1>
        <p className="opacity-70 mt-1">
          Here’s a quick overview of your recent blood donation requests.
        </p>
      </div>

      {/* Recent requests */}
      {!loading && hasRequests && (
        <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm">
          <div className="p-5 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold">Recent Donation Requests</h2>
              <p className="text-sm opacity-70">
                Showing your latest 3 requests
              </p>
            </div>

            <Link to="/dashboard/my-donation-requests" className="btn btn-secondary rounded-xl">
              View my all request
            </Link>
          </div>

          <div className="overflow-x-auto">
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
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td className="font-medium">{r.recipientName}</td>
                    <td className="text-sm opacity-80">
                      {r.recipientDistrict}, {r.recipientUpazila}
                    </td>
                    <td>{r.donationDate}</td>
                    <td>{r.donationTime}</td>
                    <td>
                      <span className="badge badge-outline">{r.bloodGroup}</span>
                    </td>

                    <td>
                      <span className={statusBadge(r.status)}>{r.status}</span>

                      {/* ✅ Done/Cancel buttons only when inprogress */}
                      {r.status === "inprogress" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => updateStatus(r._id, "done")}
                            type="button"
                          >
                            <FiCheckCircle /> Done
                          </button>
                          <button
                            className="btn btn-error btn-xs"
                            onClick={() => updateStatus(r._id, "canceled")}
                            type="button"
                          >
                            <FiXCircle /> Cancel
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="text-sm">
                      {r.status === "inprogress" ? (
                        <div className="space-y-1">
                          <p className="font-medium">{r.donorName}</p>
                          <p className="opacity-70">{r.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="opacity-60">—</span>
                      )}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/donation-requests/${r._id}`)}
                          type="button"
                          title="View"
                        >
                          <FiEye />
                        </button>

                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/dashboard/edit-donation-request/${r._id}`)}
                          type="button"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => setDeleteTarget(r)}
                          type="button"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hidden section if no requests */}
      {!loading && !hasRequests && (
        <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6">
          <h2 className="text-lg font-bold">No donation requests yet</h2>
          <p className="opacity-70 mt-1">
            Once you create a request, your 3 most recent requests will appear here.
          </p>
          <Link
            to="/dashboard/create-donation-request"
            className="btn btn-primary rounded-xl mt-4"
          >
            Create Donation Request
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6">
          <span className="loading loading-spinner loading-md"></span>
          <span className="ml-3 opacity-70">Loading your dashboard...</span>
        </div>
      )}

      {/* Delete confirmation modal */}
      <dialog id="delete_modal" className={`modal ${deleteTarget ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl">
          <h3 className="font-bold text-lg">Delete request?</h3>
          <p className="py-2 opacity-70">
            This will permanently delete the donation request for{" "}
            <span className="font-semibold">{deleteTarget?.recipientName}</span>.
          </p>

          <div className="modal-action">
            <button className="btn btn-ghost rounded-xl" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              className="btn btn-error rounded-xl"
              onClick={async () => {
                await deleteRequest(deleteTarget._id);
                setDeleteTarget(null);
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setDeleteTarget(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DashboardHome;
