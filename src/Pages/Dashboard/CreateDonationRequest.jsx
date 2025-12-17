import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";
import { donationRequestsApi } from "../../api/donationRequests.api";
import { toast } from "react-hot-toast";

import districtsRaw from "../../Data/bd-geo/districts.json";
import upazilasRaw from "../../Data/bd-geo/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const toArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.districts)) return raw.districts;
  if (Array.isArray(raw.upazilas)) return raw.upazilas;
  if (Array.isArray(raw.tables)) return raw.tables;
  return [];
};

const normalizeDistricts = (raw) => {
  const arr = toArray(raw);

  const maybeTable = arr.find(
    (x) => x?.type === "table" && String(x?.name || "").toLowerCase() === "districts"
  );
  const list = Array.isArray(maybeTable?.data) ? maybeTable.data : arr;

  return (list || [])
    .map((d) => ({
      id: String(d?.id ?? d?._id ?? d?.district_id ?? "").trim(),
      name: String(d?.name ?? d?.district ?? d?.district_name ?? d?.en_name ?? "").trim(),
    }))
    .filter((d) => d.id && d.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeUpazilas = (raw) => {
  const arr = toArray(raw);

  const maybeTable = arr.find(
    (x) => x?.type === "table" && String(x?.name || "").toLowerCase() === "upazilas"
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

  useEffect(() => {
    let alive = true;

    const loadMe = async () => {
      try {
        setLoadingUser(true);
        const res = await axiosSecure.get("/users/me");
        if (!alive) return;
        setDbUser(res.data || null);
      } catch (err) {
        if (!alive) return;
        console.log("Load /users/me error:", err?.response?.data || err?.message || err);
        setDbUser(null);
        toast.error(err?.response?.data?.message || err?.message || "Failed to load your profile");
      } finally {
        if (!alive) return;
        setLoadingUser(false);
      }
    };

    loadMe();
    return () => {
      alive = false;
    };
  }, []);

  const isBlocked = dbUser?.status === "blocked";

  const districtOptions = useMemo(() => normalizeDistricts(districtsRaw), []);
  const upazilaList = useMemo(() => normalizeUpazilas(upazilasRaw), []);

  const selectedDistrict = useMemo(
    () => districtOptions.find((d) => d.name === form.recipientDistrict) || null,
    [districtOptions, form.recipientDistrict]
  );

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
    setForm((p) => ({ ...p, recipientDistrict: value, recipientUpazila: "" }));
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
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loadingUser) return;

    if (!user?.email) {
      toast.error("You must be logged in to create a request.");
      return;
    }

    if (isBlocked) {
      toast.error("You are blocked. Only active users can create donation requests.");
      return;
    }

    const payload = {
      requesterName: dbUser?.name || user?.displayName || "User",
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

      await toast.promise(donationRequestsApi.createRequest(payload), {
        loading: "Creating request...",
        success: "✅ Donation request created!",
        error: (err) => err?.message || "Failed to create request",
      });

      resetForm();
    } finally {
      setSubmitting(false);
    }
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
      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold">Create Donation Request</h1>
        <p className="opacity-70 mt-1">
          Fill the form carefully. Your request will be created as <b>pending</b>.
        </p>
      </div>

      {isBlocked && (
        <div className="alert alert-error rounded-2xl">
          <span>
            You are <b>blocked</b>. Only active users can create donation requests.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Form</h2>
            {dbUser?.role ? (
              <span className="badge badge-secondary badge-outline capitalize">{dbUser.role}</span>
            ) : null}
          </div>

          <div className="divider my-5">Requester</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Requester Name</span>
              </label>
              <input className="input input-bordered rounded-xl" value={dbUser?.name || ""} readOnly />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Requester Email</span>
              </label>
              <input className="input input-bordered rounded-xl" value={user?.email || ""} readOnly />
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
            <button type="button" className="btn btn-ghost rounded-xl" onClick={resetForm} disabled={submitting}>
              Reset
            </button>

            <button className="btn btn-primary rounded-xl" type="submit" disabled={isBlocked || submitting}>
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

        <div className="lg:col-span-1 space-y-4">
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
