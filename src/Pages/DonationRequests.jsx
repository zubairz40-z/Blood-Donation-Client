import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FiMapPin, FiClock, FiCalendar, FiEye, FiDroplet, FiRefreshCw } from "react-icons/fi";

const DonationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL; // set this in .env

  const fetchRequests = async () => {
    setError("");
    setLoading(true);
    try {
      // ✅ Best: server returns only pending
      const res = await fetch(`${API}/donation-requests?status=pending`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load requests");

      // supports array or {items:[]}
      const list = Array.isArray(data) ? data : data?.items || [];
      setRequests(list);
    } catch (e) {
      setError(e.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fallback safety (if API returns extra)
  const pending = useMemo(
    () => requests.filter((r) => (r?.status || "").toLowerCase() === "pending"),
    [requests]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Pending Blood Donation Requests
            </h1>
            <p className="opacity-70 mt-1">
              Only pending requests are shown here. Click view to see details.
            </p>
          </div>

          <button onClick={fetchRequests} className="btn btn-ghost rounded-xl">
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error rounded-2xl mt-6">
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6 flex items-center gap-3">
          <span className="loading loading-spinner loading-md" />
          <span className="opacity-70">Loading pending requests...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && pending.length === 0 && !error && (
        <div className="mt-6 rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6">
          <h2 className="text-lg font-bold">No pending requests found</h2>
          <p className="opacity-70 mt-1">Please check back later.</p>
        </div>
      )}

      {/* Cards */}
      {!loading && pending.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pending.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="h-1 bg-secondary" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">{r.recipientName}</h3>
                    <p className="text-sm opacity-70 flex items-center gap-2 mt-1">
                      <FiMapPin />
                      <span className="truncate">
                        {r.recipientDistrict}, {r.recipientUpazila}
                      </span>
                    </p>
                  </div>

                  <span className="badge badge-outline font-semibold">
                    <FiDroplet className="mr-1" />
                    {r.bloodGroup}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-base-200/60 border border-base-300/60 p-3">
                    <p className="opacity-70 flex items-center gap-2">
                      <FiCalendar /> Date
                    </p>
                    <p className="font-semibold mt-1">{r.donationDate}</p>
                  </div>

                  <div className="rounded-xl bg-base-200/60 border border-base-300/60 p-3">
                    <p className="opacity-70 flex items-center gap-2">
                      <FiClock /> Time
                    </p>
                    <p className="font-semibold mt-1">{r.donationTime}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end">
                  {/* ✅ Details is private: PrivateRoute will redirect if not logged in */}
                  <Link to={`/donation-requests/${r._id}`} className="btn btn-secondary rounded-xl">
                    <FiEye />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
