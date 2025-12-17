import React, { useMemo, useState } from "react";
import axiosPublic from "../api/axiosPublic";

import districtsRaw from "../Data/bd-geo/districts.json";
import upazilasRaw from "../Data/bd-geo/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// robust table extraction (works with {tables:[{name,type,data}]} or direct arrays)
const toArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.tables)) return raw.tables;
  if (Array.isArray(raw.districts)) return raw.districts;
  if (Array.isArray(raw.upazilas)) return raw.upazilas;
  return [];
};

const extractTableData = (raw, tableName) => {
  const arr = toArray(raw);
  // if already like [{id,name}]
  if (Array.isArray(arr) && arr.length && arr[0]?.id && (arr[0]?.name || arr[0]?.en_name)) return arr;

  const tableObj = arr.find(
    (x) => x?.type === "table" && String(x?.name || "").toLowerCase() === tableName
  );
  if (Array.isArray(tableObj?.data)) return tableObj.data;

  return arr;
};

const Search = () => {
  const districts = useMemo(() => extractTableData(districtsRaw, "districts"), []);
  const upazilas = useMemo(() => extractTableData(upazilasRaw, "upazilas"), []);

  const districtOptions = useMemo(() => {
    return (districts || [])
      .map((d) => String(d?.name ?? d?.district ?? d?.district_name ?? d?.en_name ?? "").trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [districts]);

  const [form, setForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");

  const selectedDistrictId = useMemo(() => {
    if (!form.district) return "";
    const d = (districts || []).find(
      (x) =>
        String(x?.name ?? x?.district ?? x?.district_name ?? x?.en_name ?? "").trim() ===
        String(form.district).trim()
    );
    return d?.id != null ? String(d.id).trim() : "";
  }, [form.district, districts]);

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrictId) return [];
    return (upazilas || [])
      .filter((u) => {
        const did = String(u?.district_id ?? u?.districtId ?? u?.did ?? "").trim();
        return did && did === selectedDistrictId;
      })
      .map((u) => String(u?.name ?? u?.upazila ?? u?.upazila_name ?? u?.en_name ?? "").trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [selectedDistrictId, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      setForm((p) => ({ ...p, district: value, upazila: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearched(true);

    // optional UX: prevent empty search
    if (!form.bloodGroup && !form.district && !form.upazila) {
      setDonors([]);
      setError("Please select at least one filter (blood group / district / upazila).");
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (form.bloodGroup) params.bloodGroup = form.bloodGroup;
      if (form.district) params.district = form.district;
      if (form.upazila) params.upazila = form.upazila;

      // API should only return active donors (role=donor, status=active)
      const res = await axiosPublic.get("/donors", { params });
      setDonors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setDonors([]);
      setError(err?.response?.data?.message || err?.message || "Failed to search donors");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setForm({ bloodGroup: "", district: "", upazila: "" });
    setDonors([]);
    setError("");
    setSearched(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-base-100 border border-base-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold">Search Donors</h1>
        <p className="text-sm opacity-70 mt-1">
          Select blood group and location, then click search.
        </p>

        <form onSubmit={onSearch} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Blood group</span>
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="select select-bordered rounded-2xl w-full"
            >
              <option value="">All blood groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">District</span>
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="select select-bordered rounded-2xl w-full"
            >
              <option value="">All districts</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upazila</span>
            </label>
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              className="select select-bordered rounded-2xl w-full"
              disabled={!form.district}
            >
              <option value="">
                {form.district ? "All upazilas" : "Select district first"}
              </option>
              {upazilaOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control md:pt-9">
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-secondary rounded-2xl flex-1"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                className="btn btn-ghost rounded-2xl"
                onClick={onReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {error ? (
          <div className="mt-4 alert alert-error rounded-2xl">
            <span>{error}</span>
          </div>
        ) : null}
      </div>

      {/* Results: show only after searching */}
      {searched && (
        <div className="mt-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold">Donors</h2>
            <p className="text-sm opacity-70">
              {loading ? "Loading..." : `${donors.length} found`}
            </p>
          </div>

          {!loading && donors.length === 0 ? (
            <div className="mt-3 rounded-3xl bg-base-100 border border-base-200 p-6 text-center opacity-70">
              No donors found for your search.
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((d) => (
              <div
                key={d?._id || `${d?.email || "donor"}-${d?.bloodGroup || "bg"}`}
                className="rounded-3xl bg-base-100 border border-base-200 shadow-sm p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-2xl overflow-hidden bg-base-200">
                      {d?.avatar ? (
                        <img src={d.avatar} alt={d?.name || "Donor"} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full grid place-items-center font-bold opacity-60">
                          {(d?.name?.[0] || "D").toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold truncate">{d?.name || "Donor"}</p>
                    <p className="text-xs opacity-70 truncate">
                      {d?.district || "—"}, {d?.upazila || "—"}
                    </p>
                  </div>

                  <div className="ml-auto">
                    <span className="badge badge-secondary badge-outline font-semibold">
                      {d?.bloodGroup || "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {/* privacy: keep email hidden, but allow contact */}
                  <a
                    className="btn btn-outline rounded-2xl w-full"
                    href={d?.email ? `mailto:${d.email}` : "#"}
                    onClick={(e) => {
                      if (!d?.email) e.preventDefault();
                    }}
                  >
                    Contact
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
