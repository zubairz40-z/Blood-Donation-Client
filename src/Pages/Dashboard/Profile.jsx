import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Firebase fallback (DB will overwrite when loaded)
  const initial = useMemo(
    () => ({
      name: user?.displayName || "",
      email: user?.email || "",
      avatar: user?.photoURL || "https://i.ibb.co/2M7rtLk/default-avatar.png",
      district: "",
      upazila: "",
      bloodGroup: "",
      role: "",
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [snapshot, setSnapshot] = useState(initial);

  // ✅ Load profile from MongoDB
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingProfile(true);

        // no user -> stop
        if (!user?.email) {
          setForm(initial);
          setSnapshot(initial);
          return;
        }

        // if token missing -> keep fallback
        const token = localStorage.getItem("access-token");
        if (!token) {
          setForm(initial);
          setSnapshot(initial);
          return;
        }

        const res = await axiosSecure.get("/users/me");
        const dbUser = res?.data;

        const newForm = {
          name: dbUser?.name || initial.name,
          email: dbUser?.email || initial.email,
          avatar: dbUser?.avatar || initial.avatar,
          district: dbUser?.district || "",
          upazila: dbUser?.upazila || "",
          bloodGroup: dbUser?.bloodGroup || "",
          role: dbUser?.role || "",
        };

        setForm(newForm);
        setSnapshot(newForm);
      } catch (err) {
        console.log("Load profile error:", err?.message || err);
        setForm(initial);
        setSnapshot(initial);
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, [user?.email, initial]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ✅ Update profile in MongoDB
  const updateProfileToDB = async (payload) => {
    // requires PATCH /users/me in backend
    const res = await axiosSecure.patch("/users/me", payload);
    return res.data;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // whitelist only
      const payload = {
        name: form.name,
        avatar: form.avatar,
        district: form.district,
        upazila: form.upazila,
        bloodGroup: form.bloodGroup,
      };

      await updateProfileToDB(payload);

      // ✅ optional: sync Firebase displayName/photoURL
      if (updateUserProfile) {
        await updateUserProfile(form.name, form.avatar);
      }

      setSnapshot(form);
      setIsEditing(false);
      alert("✅ Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(snapshot);
    setIsEditing(false);
  };

  const Field = ({ label, children, hint }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs opacity-60">{hint}</p> : null}
    </div>
  );

  if (loadingProfile) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-base-300/60 bg-base-100 p-6">
          <p className="opacity-70">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm opacity-70">
            Manage your personal info. Email can’t be changed.
          </p>
        </div>

        {!isEditing ? (
          <button
            className="btn btn-secondary rounded-xl"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <FiEdit2 /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost rounded-xl"
              onClick={onCancel}
              type="button"
              disabled={saving}
            >
              <FiX /> Cancel
            </button>
            <button
              className="btn btn-primary rounded-xl"
              form="profileForm"
              type="submit"
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Card */}
      <div className="mt-6 rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm">
        {/* Top */}
        <div className="p-4 sm:p-6 border-b border-base-300/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-base-300/60 shadow-sm bg-base-200">
                <img
                  src={form.avatar}
                  alt="avatar"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-lg sm:text-xl font-bold truncate">
                    {form.name || "User"}
                  </p>

                  {form.bloodGroup ? (
                    <span className="badge badge-primary badge-outline">
                      {form.bloodGroup}
                    </span>
                  ) : (
                    <span className="badge badge-ghost">No blood group</span>
                  )}

                  {form.role ? (
                    <span className="badge badge-secondary badge-outline uppercase">
                      {form.role}
                    </span>
                  ) : null}
                </div>

                <p className="text-sm opacity-70 truncate">{form.email}</p>

                {(form.district || form.upazila) && (
                  <p className="text-sm opacity-70 mt-1">
                    {form.upazila || "—"}
                    <span className="mx-2 opacity-40">•</span>
                    {form.district || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form id="profileForm" onSubmit={onSave} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <Field label="Full Name">
              <input
                className="input input-bordered w-full rounded-xl"
                name="name"
                value={form.name}
                onChange={onChange}
                disabled={!isEditing}
                required
              />
            </Field>

            <Field label="Email (locked)" hint="Email cannot be edited">
              <input
                className="input input-bordered w-full rounded-xl"
                name="email"
                value={form.email}
                disabled
              />
            </Field>

            <Field label="Avatar URL">
              <input
                className="input input-bordered w-full rounded-xl"
                name="avatar"
                value={form.avatar}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="https://..."
              />
            </Field>

            <Field label="Blood Group">
              <select
                className="select select-bordered w-full rounded-xl"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                disabled={!isEditing}
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="District">
              <input
                className="input input-bordered w-full rounded-xl"
                name="district"
                value={form.district}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="e.g., Dhaka"
              />
            </Field>

            <Field label="Upazila">
              <input
                className="input input-bordered w-full rounded-xl"
                name="upazila"
                value={form.upazila}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="e.g., Dhanmondi"
              />
            </Field>
          </div>

          {!isEditing && (
            <div className="mt-5 rounded-xl bg-base-200/70 border border-base-300/60 p-4">
              <p className="text-sm opacity-70">
                Click <span className="font-semibold">Edit</span> to update your profile.
                Your email is permanently locked for security.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
