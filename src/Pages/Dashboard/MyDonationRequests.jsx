import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { donationRequestsApi } from "../../api/donationRequests.api";
import DonationRequestsTable from "../../Components/DashBoards/DonationRequestsTable";
import Pagination from "../../Components/DashBoards/Pagination";
import ConfirmModal from "../../Components/DashBoards/ConfirmModal";
import { toast } from "react-hot-toast";

const MyDonationRequests = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // used to avoid setting state after unmount + avoid race updates
  const aliveRef = useRef(true);
  const reqIdRef = useRef(0);

  const totalPages = useMemo(() => {
    const total = Number(data.total || 0);
    return Math.max(1, Math.ceil(total / limit));
  }, [data.total, limit]);

  // ✅ Clamp page AFTER total changes (NOT inside load)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const load = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);

    try {
      const res = await donationRequestsApi.getMyRequests({ status, page, limit });

      // if another request started after this one, ignore this response
      if (!aliveRef.current || myReqId !== reqIdRef.current) return;

      const safe = {
        items: Array.isArray(res?.items) ? res.items : [],
        total: Number(res?.total || 0),
      };

      setData(safe);
    } catch (e) {
      if (!aliveRef.current) return;

      console.error("Load my requests failed:", e);
      setData({ items: [], total: 0 });

      const msg =
        e?.message ||
        e?.response?.data?.message ||
        "Failed to load requests (check token / apiFetch headers)";
      toast.error(msg);
    } finally {
      if (!aliveRef.current) return;
      setLoading(false);
    }
  }, [status, page, limit]);

  useEffect(() => {
    aliveRef.current = true;
    load();
    return () => {
      aliveRef.current = false;
    };
  }, [load]);

  const onStatus = async (id, nextStatus) => {
    try {
      await toast.promise(donationRequestsApi.updateStatusDonor(id, nextStatus), {
        loading: "Updating status...",
        success: "Status updated ✅",
        error: (e) => e?.message || "Failed to update status",
      });

      // ✅ reload current page
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await toast.promise(donationRequestsApi.deleteRequestDonor(deleteTarget._id), {
        loading: "Deleting request...",
        success: "Request deleted ✅",
        error: (e) => e?.message || "Failed to delete request",
      });

      setDeleteTarget(null);

      // ✅ If we deleted the last row on this page, go back one page.
      // The load will be triggered by page change.
      if (data.items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await load();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const EmptyState = () => (
    <div className="p-10 text-center">
      <p className="text-lg font-bold">No requests found</p>
      <p className="opacity-70 text-sm mt-2 max-w-xl mx-auto">
        If you created requests but don’t see them, the most common reasons are:
        <br />
        <span className="font-medium">1)</span> Your JWT token is missing/expired (login again)
        <br />
        <span className="font-medium">2)</span> apiFetch is not attaching{" "}
        <span className="font-mono">Authorization: Bearer access-token</span>
        <br />
        <span className="font-medium">3)</span> requesterEmail didn’t match the JWT email at creation time
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Blood Requests</h1>
          <p className="opacity-70 text-sm">Manage all blood requests you created.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost rounded-xl"
            type="button"
            onClick={load}
            disabled={loading}
            title="Refresh"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Refreshing
              </>
            ) : (
              "Refresh"
            )}
          </button>

          <select
            className="select select-bordered rounded-xl"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All status</option>
            <option value="pending">pending</option>
            <option value="inprogress">inprogress</option>
            <option value="done">done</option>
            <option value="canceled">canceled</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm">
        {loading ? (
          <div className="p-6 flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span className="opacity-70">Loading...</span>
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-2">
            <DonationRequestsTable
              rows={data.items}
              mode="donor"
              onDelete={setDeleteTarget}
              onStatus={onStatus}
              onEditRoute="/dashboard/edit-donation-request"
            />

            <div className="px-4 pb-4">
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete request?"
        message={`This will permanently delete the request for ${
          deleteTarget?.recipientName || ""
        }.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default MyDonationRequests;
