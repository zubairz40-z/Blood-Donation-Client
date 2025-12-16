import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import axiosPublic from "../../api/axiosPublic";
import { donationRequestsApi } from "../../api/donationRequests.api";

import districtsRaw from "../../Data/bd-geo/districts.json";
import upazilasRaw from "../../Data/bd-geo/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ✅ Normalize JSON of any common shape into array
const toArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.districts)) return raw.districts;
  if (Array.isArray(raw.upazilas)) return raw.upazilas;
  if (Array.isArray(raw.tables)) return raw.tables;
  return [];
};

// ✅ Make sure districts become: [{id, name}]
const normalizeDistricts = (raw) => {
  const arr = toArray(raw);

  const maybeTable = arr.find(
    (x) =>
      x?.type === "table" &&
      String(x?.name || "").toLowerCase() === "districts"
  );
  const list = Array.isArray(maybeTable?.data) ? maybeTable.data : arr;

  return (list || [])
    .map((d) => ({
      id: String(d?.id ?? d?._id ?? d?.district_id ?? "").trim(),
      name: String(
        d?.name ?? d?.district ?? d?.district_name ?? d?.en_name ?? ""
      ).trim(),
    }))
    .filter((d) => d.id && d.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// ✅ Make sure upazilas become: [{district_id, name}]
const normalizeUpazilas = (raw) => {
  const arr = toArray(raw);

  const maybeTable = arr.find(
    (x) =>
      x?.type === "table" && String(x?.name || "").toLowerCase() === "upazilas"
  );
  const list = Array.isArray(maybeTable?.data) ? maybeTable.data : arr;

  return (list || [])
    .map((u) => ({
      district_id: String(u?.district_id ?? u?.districtId ?? u?.did ?? "").trim(),
      name: String(u?.name ?? u?.upazila ?? u?.upazila_name ?? u?.en_name ?? "").trim(),
    }))
    .filter((u) => u.district_id && u.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const CreateDonationRequest = () => {
  const { user } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // ✅ Load user from MongoDB (truth)
  useEffect(() => {
    const loadMe = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("access-token");
        if (!token) {
          setDbUser(null);
          return;
        }
        const res = await axiosPublic.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDbUser(res.data || null);
      } catch (err) {
        console.log("Load /users/me error:", err?.response?.data || err?.message || err);
        setDbUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadMe();
  }, []);

  const isBlocked = dbUser?.status === "blocked";

  const districtOptions = useMemo(() => normalizeDistricts(districtsRaw), []);
  const upazilaList = useMemo(() => normalizeUpazilas(upazilasRaw), []);

  const selectedDistrict = useMemo(() => {
    return districtOptions.find((d) => d.name === form.recipientDistrict) || null;
  }, [districtOptions, form.recipientDistrict]);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict?.id) return [];
    return upazilaList
      .filter((u) => String(u.district_id) === String(selectedDistrict.id))
      .map((u) => u.name);
  }, [upazilaList, selectedDistrict]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onDistrictChange = (e) => {
    const value = e.target.value;
    setForm((p) => ({
      ...p,
      recipientDistrict: value,
      recipientUpazila: "",
    }));
  };

  const resetForm = () => {
    setForm({
      recipientName: "",
      recipientDistrict: "",
      recipientUpazila: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loadingUser) return;

    if (!user?.email) {
      setError("You must be logged in to create a request.");
      return;
    }

    if (isBlocked) {
      setError("You are blocked. Only active users can create donation requests.");
      return;
    }

    // ✅ No status field in UI; backend should set pending (assignment rule)
    const payload = {
      requesterName: dbUser?.name || user?.displayName || "User",
      requesterEmail: user?.email,
      recipientName: form.recipientName,
      recipientDistrict: form.recipientDistrict,
      recipientUpazila: form.recipientUpazila,
      hospitalName: form.hospitalName,
      fullAddress: form.fullAddress,
      bloodGroup: form.bloodGroup,
      donationDate: form.donationDate,
      donationTime: form.donationTime,
      requestMessage: form.requestMessage,
    };

    try {
      setSubmitting(true);
      await donationRequestsApi.createRequest(payload);
      resetForm();
      alert("✅ Donation request created!");
    } catch (err) {
      console.log("Create request error:", err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || "Failed to create donation request");
    } finally {
      setSubmitting(false);
    }
  };

  const PreviewCard = () => {
    const v = (x) => (x ? x : "—");
    return (
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-base">Preview</h3>
          <span className="badge badge-outline capitalize">pending</span>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="opacity-60">Recipient</span>
            <span className="font-medium text-right">{v(form.recipientName)}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="opacity-60">Blood Group</span>
            <span className="font-medium">{v(form.bloodGroup)}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="opacity-60">Location</span>
            <span className="font-medium text-right">
              {v(form.recipientUpazila)}, {v(form.recipientDistrict)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="opacity-60">Date & Time</span>
            <span className="font-medium text-right">
              {v(form.donationDate)} • {v(form.donationTime)}
            </span>
          </div>

          <div className="pt-1">
            <p className="opacity-60">Hospital</p>
            <p className="font-medium">{v(form.hospitalName)}</p>
          </div>

          <div className="pt-1">
            <p className="opacity-60">Address</p>
            <p className="font-medium">{v(form.fullAddress)}</p>
          </div>

          <div className="pt-1">
            <p className="opacity-60">Message</p>
            <p className="font-medium whitespace-pre-wrap">{v(form.requestMessage)}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loadingUser) {
    return (
      <div className="rounded-2xl border border-base-300/60 bg-base-100 p-6">
        <div className="flex items-center gap-3">
          <span className="loading loading-spinner loading-md" />
          <span className="opacity-70">Loading your account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold">Create Donation Request</h1>
        <p className="opacity-70 mt-1">
          Fill the form carefully. Your request will be created as <b>pending</b>.
        </p>
      </div>

      {/* Alerts */}
      {isBlocked && (
        <div className="alert alert-error rounded-2xl">
          <span>
            You are <b>blocked</b>. Only active users can create donation requests.
          </span>
        </div>
      )}

      {error && !isBlocked && (
        <div className="alert alert-warning rounded-2xl">
          <span>{error}</span>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Form</h2>
            {dbUser?.role ? (
              <span className="badge badge-secondary badge-outline capitalize">
                {dbUser.role}
              </span>
            ) : null}
          </div>

          <div className="divider my-5">Requester</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Requester Name</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                value={dbUser?.name || user?.displayName || ""}
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Requester Email</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="divider my-5">Recipient & Donation</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Recipient Name</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                name="recipientName"
                value={form.recipientName}
                onChange={onChange}
                required
                placeholder="e.g., Rahim Uddin"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Blood Group</span>
              </label>
              <select
                className="select select-bordered rounded-xl"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                required
              >
                <option value="" disabled>
                  Select blood group
                </option>
                {bloodGroups.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">District</span>
              </label>
              <select
                className="select select-bordered rounded-xl"
                name="recipientDistrict"
                value={form.recipientDistrict}
                onChange={onDistrictChange}
                required
              >
                <option value="" disabled>
                  Select district
                </option>
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Upazila</span>
              </label>
              <select
                className="select select-bordered rounded-xl"
                name="recipientUpazila"
                value={form.recipientUpazila}
                onChange={onChange}
                required
                disabled={!selectedDistrict?.id}
              >
                <option value="" disabled>
                  {selectedDistrict?.id ? "Select upazila" : "Select district first"}
                </option>
                {filteredUpazilas.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Donation Date</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                type="date"
                name="donationDate"
                value={form.donationDate}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Donation Time</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                type="time"
                name="donationTime"
                value={form.donationTime}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="divider my-5">Hospital & Message</div>

          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Hospital Name</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                name="hospitalName"
                value={form.hospitalName}
                onChange={onChange}
                required
                placeholder="e.g., Dhaka Medical College Hospital"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Address</span>
              </label>
              <input
                className="input input-bordered rounded-xl"
                name="fullAddress"
                value={form.fullAddress}
                onChange={onChange}
                required
                placeholder="Street, area, landmark..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Request Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered rounded-xl"
                name="requestMessage"
                value={form.requestMessage}
                onChange={onChange}
                rows={4}
                required
                placeholder="Explain why blood is needed..."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-ghost rounded-xl"
              onClick={resetForm}
              disabled={submitting}
            >
              Reset
            </button>

            <button
              className="btn btn-primary rounded-xl"
              type="submit"
              disabled={isBlocked || submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Request"
              )}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="lg:col-span-1 space-y-4">
          <PreviewCard />
          <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5 text-sm">
            <p className="font-bold">Tips</p>
            <ul className="mt-2 list-disc ml-5 opacity-70 space-y-1">
              <li>Select correct district & upazila.</li>
              <li>Hospital name must be clear.</li>
              <li>Write short and clear message.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
