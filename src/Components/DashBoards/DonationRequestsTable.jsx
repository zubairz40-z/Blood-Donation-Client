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
 *  - "donor" => edit/delete/view + done/cancel when inprogress
 *  - "admin" => full actions
 *  - "volunteer" => only status update (no edit/delete)
 */
const DonationRequestsTable = ({
  rows,
  mode,
  onDelete,
  onStatus,
  onEditRoute,
  detailsRouteBase = "/donation-requests",
}) => {
  const navigate = useNavigate();

  const canEdit = mode === "donor" || mode === "admin";
  const canDelete = mode === "donor" || mode === "admin";
  const canStatus = mode === "donor" || mode === "admin" || mode === "volunteer";

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
              <td><span className="badge badge-outline">{r.bloodGroup}</span></td>

              <td>
                <span className={badge(r.status)}>{r.status}</span>

                {/* ✅ done/cancel only when inprogress + allowed */}
                {canStatus && r.status === "inprogress" && (
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-success btn-xs" onClick={() => onStatus(r._id, "done")} type="button">
                      <FiCheckCircle /> Done
                    </button>
                    <button className="btn btn-error btn-xs" onClick={() => onStatus(r._id, "canceled")} type="button">
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
                    type="button"
                    onClick={() => navigate(`${detailsRouteBase}/${r._id}`)}
                    title="View"
                  >
                    <FiEye />
                  </button>

                  {canEdit && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => navigate(`${onEditRoute}/${r._id}`)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  )}

                  {canDelete && (
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
        </tbody>
      </table>
    </div>
  );
};

export default DonationRequestsTable;
