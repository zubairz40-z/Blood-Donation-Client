import React, { useCallback, useEffect, useMemo, useState } from "react";
import { donationRequestsApi } from "../../api/donationRequests.api";

import DonationRequestsTable from "../../Components/DashBoards/DonationRequestsTable";
import Pagination from "../../Components/DashBoards/Pagination";
import ConfirmModal from "../../Components/DashBoards/ConfirmModal";

const MyDonationRequests = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalPages = useMemo(() => {
    const total = Number(data.total || 0);
    return Math.max(1, Math.ceil(total / limit));
  }, [data.total, limit]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await donationRequestsApi.getMyRequests({ status, page, limit });

      const safe = {
        items: Array.isArray(res?.items) ? res.items : [],
        total: Number(res?.total || 0),
      };

      setData(safe);

      // If current page becomes invalid after delete/filter, fix it
      const nextTotalPages = Math.max(1, Math.ceil(safe.total / limit));
      if (page > nextTotalPages) setPage(nextTotalPages);
    } catch (e) {
      console.error("Load my requests failed:", e);
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [status, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const onStatus = async (id, nextStatus) => {
    try {
      await donationRequestsApi.updateStatusDonor(id, nextStatus);
      await load();
    } catch (e) {
      console.error("Update status failed:", e);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await donationRequestsApi.deleteRequestDonor(deleteTarget._id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Blood Requests</h1>
          <p className="opacity-70 text-sm">Manage all blood requests you created.</p>
        </div>

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

      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm">
        {loading ? (
          <div className="p-6 flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span className="opacity-70">Loading...</span>
          </div>
        ) : data.items.length === 0 ? (
          <div className="p-6">
            <p className="font-bold">No requests found.</p>
            <p className="opacity-70">Try changing filters or create a new request.</p>
          </div>
        ) : (
          <div className="p-2">
            <DonationRequestsTable
              rows={data.items}
              mode="donor" // keep this if your table expects "donor" for owner actions
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete request?"
        message={`This will permanently delete the request for ${deleteTarget?.recipientName || ""}.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default MyDonationRequests;
