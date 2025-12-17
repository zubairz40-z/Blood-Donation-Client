import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import useUserRole from "../Hooks/useUserRole";
import { usersApi } from "../api/users.api";

import districtsRaw from "../Data/bd-geo/districts.json";
import upazilasRaw from "../Data/bd-geo/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// helpers
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

const BecomeDonor = () => {
  const { dbUser } = useUserRole();

  const districtOptions = useMemo(() => normalizeDistricts(districtsRaw), []);
  const upazilaList = useMemo(() => normalizeUpazilas(upazilasRaw), []);

  const [form, setForm] = useState({
    bloodGroup: dbUser?.bloodGroup || "",
    district: dbUser?.district || "",
    upazila: dbUser?.upazila || "",
  });

  const [saving, setSaving] = useState(false);

  const selectedDistrict = useMemo(
    () => districtOptions.find((d) => d.name === form.district) || null,
    [districtOptions, form.district]
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
    setForm((p) => ({ ...p, district: value, upazila: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.bloodGroup || !form.district || !form.upazila) {
      toast.error("Please complete all fields.");
      return;
    }

    const t = toast.loading("Updating profile...");

    try {
      setSaving(true);

      await usersApi.updateMe({
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });

      toast.success("Profile updated ✅ Now you are ready to donate!", { id: t });
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to update profile", { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Become a Donor</h1>
          <p className="opacity-70 mt-1">Complete your donor information.</p>
        </div>

        <span className="badge badge-outline">
          Status: {dbUser?.status || "—"}
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Select
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
            name="district"
            value={form.district}
            onChange={onDistrictChange}
            required
          >
            <option value="" disabled>
              Select
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
            name="upazila"
            value={form.upazila}
            onChange={onChange}
            disabled={!selectedDistrict?.id}
            required
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

        <div className="md:col-span-2 flex justify-end">
          <button className="btn btn-secondary rounded-xl" disabled={saving}>
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BecomeDonor;
