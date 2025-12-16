import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axiosPublic from "../api/axiosPublic";

const DonationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // basic pagination (optional but good)
  const [page, setPage] = useState(1);
  const limit = 12;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      setLoading(true);
      try {
        const res = await axiosPublic.get("/donation-requests", {
          params: { status: "pending", page, limit },
        });

        if (!ignore) {
          setItems(res?.data?.items || []);
          setTotal(res?.data?.total || 0);
        }
      } catch (err) {
        if (!ignore) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-base-100 border border-base-200 shadow-sm p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold">Pending Donation Requests</h1>
            <p className="text-sm opacity-70 mt-1">
              Only pending requests are shown here.
            </p>
          </div>

          <div className="text-sm opacity-70">
            {loading ? "Loading..." : `${total} total`}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 p-6 flex items-center gap-3">
          <span className="loading loading-spinner loading-md" />
          <span className="opacity-70">Loading requests...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 p-6 text-center opacity-70">
          No pending donation requests found.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <div
              key={r._id}
              className="rounded-3xl bg-base-100 border border-base-200 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs opacity-60 font-semibold">RECIPIENT</p>
                  <h3 className="text-lg font-bold mt-1">{r.recipientName}</h3>
                  <p className="text-sm opacity-70 mt-1">
                    {r.recipientDistrict}, {r.recipientUpazila}
                  </p>
                </div>

                <span className="badge badge-secondary badge-outline font-semibold">
                  {r.bloodGroup}
                </span>
              </div>

              <div className="mt-4 text-sm opacity-80 space-y-1">
                <p>
                  <b>Date:</b> {r.donationDate}
                </p>
                <p>
                  <b>Time:</b> {r.donationTime}
                </p>
                <p className="truncate">
                  <b>Hospital:</b> {r.hospitalName || "—"}
                </p>
              </div>

              <div className="mt-5">
                <Link
                  to={`/donation-requests/${r._id}`}
                  className="btn btn-secondary rounded-2xl w-full"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <button
            className="btn btn-sm rounded-xl"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span className="text-sm opacity-70">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <button
            className="btn btn-sm rounded-xl"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
