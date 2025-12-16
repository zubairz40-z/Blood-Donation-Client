import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "../Hooks/useAuth";
import {
  FiMapPin,
  FiDroplet,
  FiCalendar,
  FiClock,
  FiHome,
  FiMail,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const API = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [req, setReq] = useState(null);
  const [error, setError] = useState("");
  const [donating, setDonating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("access-token");

  const fetchDetails = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/donation-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load details");
      setReq(data);
    } catch (e) {
      setError(e.message);
      setReq(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canDonate = useMemo(() => {
    return req?.status?.toLowerCase() === "pending";
  }, [req?.status]);

  const onConfirmDonate = async () => {
    setDonating(true);
    try {
      const payload = {
        donorName: user?.displayName || "Donor",
        donorEmail: user?.email,
      };

      const res = await fetch(`${API}/donation-requests/${id}/donate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Donation confirm failed");

      setModalOpen(false);
      await fetchDetails();
    } catch (e) {
      setError(e.message);
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm p-6 flex items-center gap-3">
        <span className="loading loading-spinner loading-md" />
        <span className="opacity-70">Loading request details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="alert alert-error rounded-2xl">
          <span>{error}</span>
        </div>
        <button className="btn btn-ghost rounded-xl" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!req) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Donation Request Details
            </h1>
            <p className="opacity-70 mt-1">Request ID: {req._id}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-outline font-semibold">
              <FiDroplet className="mr-1" />
              {req.bloodGroup}
            </span>
            <span
              className={`badge font-semibold ${
                req.status === "pending"
                  ? "badge-warning"
                  : req.status === "inprogress"
                  ? "badge-info"
                  : req.status === "done"
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {req.status}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Requester */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
            <p className="text-xs font-semibold opacity-60">REQUESTER</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <FiUser />{" "}
                <span className="font-medium">{req.requesterName}</span>
              </p>
              <p className="flex items-center gap-2 opacity-80">
                <FiMail /> {req.requesterEmail}
              </p>
            </div>
          </div>

          {/* Recipient */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
            <p className="text-xs font-semibold opacity-60">RECIPIENT</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="font-medium">{req.recipientName}</p>
              <p className="flex items-center gap-2 opacity-80">
                <FiMapPin />
                {req.recipientDistrict}, {req.recipientUpazila}
              </p>
            </div>
          </div>

          {/* Hospital & Address */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4 md:col-span-2">
            <p className="text-xs font-semibold opacity-60">DONATION LOCATION</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <FiHome />{" "}
                <span className="font-medium">{req.hospitalName}</span>
              </p>
              <p className="opacity-80">{req.fullAddress}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
            <p className="text-xs font-semibold opacity-60">SCHEDULE</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <FiCalendar />{" "}
                <span className="font-medium">{req.donationDate}</span>
              </p>
              <p className="flex items-center gap-2 opacity-80">
                <FiClock /> {req.donationTime}
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4">
            <p className="text-xs font-semibold opacity-60">REQUEST MESSAGE</p>
            <p className="mt-2 text-sm opacity-80 whitespace-pre-wrap">
              {req.requestMessage}
            </p>
          </div>

          {/* Donor info */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300/60 p-4 md:col-span-2">
            <p className="text-xs font-semibold opacity-60">DONOR INFORMATION</p>
            {req.status === "inprogress" ? (
              <div className="mt-2 text-sm space-y-1">
                <p className="font-medium">{req.donorName}</p>
                <p className="opacity-80">{req.donorEmail}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm opacity-60">No donor assigned yet.</p>
            )}
          </div>
        </div>

        {/* Donate button */}
        <div className="mt-6 flex justify-end">
          <button
            className="btn btn-primary rounded-xl"
            onClick={() => setModalOpen(true)}
            disabled={!canDonate}
            type="button"
          >
            <FiCheckCircle />
            Donate
          </button>
        </div>

        {!canDonate && (
          <p className="mt-2 text-sm opacity-60 text-right">
            Donate is available only when status is <b>pending</b>.
          </p>
        )}
      </div>

      {/* Modal */}
      <dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl">
          <h3 className="font-bold text-lg">Confirm Donation</h3>
          <p className="opacity-70 mt-1">
            Your name and email will be attached and status will become{" "}
            <b>inprogress</b>.
          </p>

          <div className="mt-4 space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Donor Name</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                value={user?.displayName || "Donor"}
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Donor Email</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-ghost rounded-xl"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary rounded-xl"
              onClick={onConfirmDonate}
              disabled={donating}
              type="button"
            >
              {donating ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DonationRequestDetails;
