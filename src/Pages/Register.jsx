import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";

import useAuth from "../Hooks/useAuth";
import axiosPublic from "../api/axiosPublic";
import uploadToImgbb from "../utils/uploadToImgbb";

import LoginImage from "../assets/Blood donation-pana.png";
import Googleicon from "../assets/google.png";
import Logo from "../Components/Logo/Logo";

import districtsRaw from "../Data/bd-geo/districts.json";
import upazilasRaw from "../Data/bd-geo/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const extractTableData = (raw, tableName) => {
  if (!raw) return [];
  if (Array.isArray(raw) && raw.length && raw[0]?.id && raw[0]?.name) return raw;

  if (Array.isArray(raw)) {
    const tableObj = raw.find(
      (x) => x?.type === "table" && String(x?.name).toLowerCase() === tableName
    );
    if (tableObj?.data && Array.isArray(tableObj.data)) return tableObj.data;
  }

  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
};

const Register = () => {
  const navigate = useNavigate();
  const { createUser, updateUserProfile } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: null,
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const districts = useMemo(() => extractTableData(districtsRaw, "districts"), []);
  const upazilas = useMemo(() => extractTableData(upazilasRaw, "upazilas"), []);

  const districtOptions = useMemo(() => {
    return (districts || [])
      .map((d) => d?.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [districts]);

  const upazilaOptions = useMemo(() => {
    if (!form.district) return [];

    const selectedDistrict = (districts || []).find(
      (d) => String(d?.name) === String(form.district)
    );
    if (!selectedDistrict?.id) return [];

    const did = String(selectedDistrict.id);

    return (upazilas || [])
      .filter((u) => String(u?.district_id) === did)
      .map((u) => u?.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [form.district, districts, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      setForm((p) => ({ ...p, district: value, upazila: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, avatar: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.avatar) {
      toast.error("Please select an avatar image.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    const t = toast.loading("Creating account...");

    try {
      setSubmitting(true);

      // 1) Firebase create
      const result = await createUser(form.email.trim(), form.password);
      const fbUser = result.user;

      // 2) Upload avatar to imgBB
      const avatarURL = await uploadToImgbb(form.avatar);

      // 3) Update Firebase profile
      await updateUserProfile(form.name.trim(), avatarURL);

      // 4) Get firebase token → backend JWT
      const firebaseToken = await fbUser.getIdToken(true);
      const jwtRes = await axiosPublic.post("/jwt", { token: firebaseToken });

      if (!jwtRes?.data?.token) throw new Error("JWT failed");
      localStorage.setItem("access-token", jwtRes.data.token);

      // 5) Save user to MongoDB
      await axiosPublic.post("/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: avatarURL,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });

      toast.success("Account created ✅", { id: t });
      navigate("/dashboard");
    } catch (err) {
      console.log("Register error:", err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.message || err?.message || "Register failed", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center py-10">
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-xl">
          {/* Left */}
          <div className="relative">
            <div className="hidden lg:block absolute top-0 right-0 h-full w-px bg-base-200" />

            <div className="h-full flex items-center justify-center lg:justify-start px-6 py-10 sm:px-10">
              <div className="w-full max-w-md">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                    Create account
                  </h2>
                  <p className="text-sm text-base-content/70">
                    New users are created as <b>donor</b> with status <b>active</b>.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      className="input input-bordered rounded-2xl"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className="input input-bordered rounded-2xl"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Avatar</span>
                      <span className="label-text-alt text-base-content/60">
                        (uploads to imgBB)
                      </span>
                    </label>
                    <input
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatar}
                      className="file-input file-input-bordered w-full rounded-2xl"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Blood group</span>
                    </label>
                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                      className="select select-bordered rounded-2xl w-full"
                      required
                    >
                      <option value="" disabled>
                        Select blood group
                      </option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">District</span>
                      </label>
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className="select select-bordered rounded-2xl w-full"
                        required
                      >
                        <option value="" disabled>
                          Select district
                        </option>
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
                        required
                        disabled={!form.district}
                      >
                        <option value="" disabled>
                          {form.district ? "Select upazila" : "Select district first"}
                        </option>
                        {upazilaOptions.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <div className="join w-full">
                      <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type={showPass ? "text" : "password"}
                        className="input input-bordered join-item w-full rounded-l-2xl"
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="btn btn-outline join-item rounded-r-2xl min-w-[92px]"
                        onClick={() => setShowPass((s) => !s)}
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirm password</span>
                    </label>
                    <div className="join w-full">
                      <input
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        type={showConfirm ? "text" : "password"}
                        className="input input-bordered join-item w-full rounded-l-2xl"
                        placeholder="Repeat password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="btn btn-outline join-item rounded-r-2xl min-w-[92px]"
                        onClick={() => setShowConfirm((s) => !s)}
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn w-full rounded-2xl bg-secondary text-secondary-content hover:bg-secondary/90 border-0"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Registering..." : "Register"}
                  </button>

                  <p className="text-sm text-center text-base-content/70">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-hover font-semibold text-secondary">
                      Login
                    </Link>
                  </p>
                </form>

                <div className="divider my-6">OR</div>

                <button
                  type="button"
                  className="btn btn-outline w-full rounded-2xl border-secondary/30 hover:border-secondary flex items-center justify-center gap-2"
                  onClick={() => toast("Social login not required 🙂")}
                >
                  <span>Continue with Google</span>
                  <img src={Googleicon} alt="Google" className="w-5 h-5" />
                </button>

                <p className="mt-4 text-xs text-center text-base-content/60">
                  By continuing, you agree to our Terms &amp; Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative bg-secondary/10 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-10 sm:px-10 text-center">
              <h3 className="text-2xl sm:text-xl font-bold text-secondary">
                Join <Logo />
              </h3>
              <p className="text-sm text-base-content/70">
                Register now and become a donor by default.
              </p>

              <img
                src={LoginImage}
                alt="Blood donation illustration"
                className="mt-6 w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto drop-shadow"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
