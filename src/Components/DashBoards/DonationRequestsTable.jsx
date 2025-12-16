import React from "react";
import { FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router";

const badge = (status) => {
  const base = "badge font-medium";
  if (status === "pending") return `${base} badge-warning`;
  if (status === "inprogress") return `${base} badge-info`;
  if (status === "done") return `${base} badge-success`;
  if (status === "canceled") return `${base} badge-error`;
  return `${base} badge-ghost`;
};

/**
 * mode:
 *  - "donor" => view/edit/delete + done/cancel only when inprogress
 *  - "admin" => view/edit/delete + status dropdown always
 *  - "volunteer" => view + status dropdown always (no edit/delete)
 */
const DonationRequestsTable = ({
  rows = [],
  mode = "donor",
  onDelete,
  onStatus,
  onEditRoute,
  detailsRouteBase = "/donation-requests",
}) => {
  const navigate = useNavigate();

  const canEdit = mode === "donor" || mode === "admin";
  const canDelete = mode === "donor" || mode === "admin";

  return (
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
          {rows.map((r) => (
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

              {/* ✅ STATUS COLUMN */}
              <td>
                <span className={badge(r.status)}>{r.status}</span>

                {/* ✅ Donor: done/cancel only when inprogress */}
                {mode === "donor" && r.status === "inprogress" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="btn btn-success btn-xs"
                      onClick={() => onStatus?.(r._id, "done")}
                      type="button"
                    >
                      <FiCheckCircle /> Done
                    </button>
                    <button
                      className="btn btn-error btn-xs"
                      onClick={() => onStatus?.(r._id, "canceled")}
                      type="button"
                    >
                      <FiXCircle /> Cancel
                    </button>
                  </div>
                )}

                {/* ✅ Admin/Volunteer: status dropdown always */}
                {(mode === "admin" || mode === "volunteer") && (
                  <div className="mt-2">
                    <select
                      className="select select-bordered select-xs rounded-lg"
                      value={r.status}
                      onChange={(e) => onStatus?.(r._id, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="inprogress">inprogress</option>
                      <option value="done">done</option>
                      <option value="canceled">canceled</option>
                    </select>
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

              {/* ✅ ACTIONS */}
              <td className="text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    onClick={() => navigate(`${detailsRouteBase}/${r._id}`)}
                    title="View"
                  >
                    <FiEye />
                  </button>

                  {canEdit && onEditRoute && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => navigate(`${onEditRoute}/${r._id}`)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  )}

                  {canDelete && typeof onDelete === "function" && (
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      type="button"
                      onClick={() => onDelete(r)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center opacity-70 py-8">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationRequestsTable;
