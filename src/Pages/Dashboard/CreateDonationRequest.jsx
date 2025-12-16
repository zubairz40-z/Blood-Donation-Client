import React, { useMemo, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { donationRequestsApi } from "../../api/donationRequests.api";

import districts from "../../Data/bd-geo/districts.json";
import upazilas from "../../Data/bd-geo/upazilas.json";

const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const CreateDonationRequest = () => {
  const { user } = useAuth();

  // You MUST load user status from DB in real app:
  const userStatus = user?.status || "active"; // "active" | "blocked"

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

  const filteredUpazilas = useMemo(() => {
    // adjust this according to your upazilas.json structure
    // common: upazilas.filter(u => u.district_id === selectedDistrictId)
    return upazilas.filter((u) => u.district === form.recipientDistrict);
  }, [form.recipientDistrict]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (userStatus === "blocked") return;

    const payload = {
      requesterName: user?.displayName || "User",
      requesterEmail: user?.email,
      ...form,
      status: "pending", // ✅ default value
      createdAt: new Date().toISOString(),
    };

    await donationRequestsApi.createRequest(payload);
    // navigate to my requests or show toast
    alert("Donation request created!");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create Donation Request</h1>
        <p className="opacity-70 text-sm">Fill in details carefully.</p>
      </div>

      {userStatus === "blocked" && (
        <div className="alert alert-error rounded-2xl">
          <span>You are blocked. Only active users can create donation requests.</span>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-4 lg:p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Requester Name</span></label>
            <input className="input input-bordered rounded-xl" value={user?.displayName || ""} readOnly />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Requester Email</span></label>
            <input className="input input-bordered rounded-xl" value={user?.email || ""} readOnly />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Recipient Name</span></label>
            <input className="input input-bordered rounded-xl" name="recipientName" value={form.recipientName} onChange={onChange} required />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Blood Group</span></label>
            <select className="select select-bordered rounded-xl" name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
              <option value="">Select</option>
              {bloodGroups.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Recipient District</span></label>
            <select
              className="select select-bordered rounded-xl"
              name="recipientDistrict"
              value={form.recipientDistrict}
              onChange={(e) => {
                setForm((p) => ({ ...p, recipientDistrict: e.target.value, recipientUpazila: "" }));
              }}
              required
            >
              <option value="">Select district</option>
              {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Recipient Upazila</span></label>
            <select
              className="select select-bordered rounded-xl"
              name="recipientUpazila"
              value={form.recipientUpazila}
              onChange={onChange}
              required
              disabled={!form.recipientDistrict}
            >
              <option value="">Select upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label"><span className="label-text font-medium">Hospital Name</span></label>
            <input className="input input-bordered rounded-xl" name="hospitalName" value={form.hospitalName} onChange={onChange} required />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label"><span className="label-text font-medium">Full Address Line</span></label>
            <input className="input input-bordered rounded-xl" name="fullAddress" value={form.fullAddress} onChange={onChange} required />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Donation Date</span></label>
            <input className="input input-bordered rounded-xl" type="date" name="donationDate" value={form.donationDate} onChange={onChange} required />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Donation Time</span></label>
            <input className="input input-bordered rounded-xl" type="time" name="donationTime" value={form.donationTime} onChange={onChange} required />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label"><span className="label-text font-medium">Request Message</span></label>
            <textarea className="textarea textarea-bordered rounded-xl" name="requestMessage" value={form.requestMessage} onChange={onChange} rows={4} required />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn btn-primary rounded-xl" type="submit" disabled={userStatus === "blocked"}>
            Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
