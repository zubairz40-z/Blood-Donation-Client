import React, { useEffect, useMemo, useState } from "react";
import useUserRole from "../../Hooks/useUserRole";
import { donationRequestsApi } from "../../api/donationRequests.api";
import DonationRequestsTable from "../../Components/DashBoards/DonationRequestsTable";
import Pagination from "../../Components/DashBoards/Pagination";
import ConfirmModal from "../../Components/DashBoards/ConfirmModal";

const AllBloodDonationRequests = () => {
  const { role, roleLoading } = useUserRole(); // ✅ role from DB
  const isVolunteer = role === "volunteer";
  const isAdmin = role === "admin";

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalPages = useMemo(
    () => Math.ceil((data.total || 0) / limit) || 1,
    [data.total]
  );

  const load = async () => {
    setLoading(true);
    try {
      // ✅ admin/volunteer should call admin endpoint
      const res = await donationRequestsApi.getAllRequests({ status, page, limit });
      setData(res);
    } catch (e) {
      console.error(e);
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const onStatus = async (id, next) => {
    // ✅ volunteer can only update status, backend allows it
    await donationRequestsApi.updateStatusAdmin(id, next);
    await load();
  };

  const onConfirmDelete = async () => {
    await donationRequestsApi.deleteRequestAdmin(deleteTarget._id);
    setDeleteTarget(null);
    await load();
  };

  if (roleLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Blood Donation Requests</h1>
          <p className="opacity-70 text-sm">
            {isVolunteer
              ? "You can filter requests and update status only."
              : "You can manage all requests."}
          </p>
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
          </div>
        ) : (
          <div className="p-2">
            <DonationRequestsTable
              rows={data.items}
              mode={isVolunteer ? "volunteer" : "admin"} // ✅ table decides what buttons show
              onDelete={isAdmin ? setDeleteTarget : () => {}}
              onStatus={onStatus}
              onEditRoute="/dashboard/edit-donation-request"
            />

            <div className="px-4 pb-4">
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* ✅ Admin only delete modal */}
      <ConfirmModal
        open={isAdmin && !!deleteTarget}
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

export default AllBloodDonationRequests;
