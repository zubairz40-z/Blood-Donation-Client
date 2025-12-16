import React, { useCallback, useEffect, useState } from "react";
import { usersApi } from "../../api/users.api";
import useAuth from "../../Hooks/useAuth";

const AllUsers = () => {
  const { user } = useAuth();
  const myEmail = user?.email || "";

  const [status, setStatus] = useState(""); // "", "active", "blocked"
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { title, message, action }

  const defaultAvatar = "https://i.ibb.co/2M7rtLk/default-avatar.png";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ make sure usersApi calls GET /admin/users?status=
      const res = await usersApi.getAllUsers({ status });
      const list = Array.isArray(res) ? res : res?.items || res?.data?.items || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const onAction = async (id, fn) => {
    try {
      setBusyId(id);
      await fn();
      await load();
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.message || e?.message || "Action failed");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Users</h1>
          <p className="opacity-70 text-sm">Manage roles and user status.</p>
        </div>

        <select
          className="select select-bordered rounded-xl"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6 flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span className="opacity-70">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6">
            <p className="font-bold">No users found.</p>
          </div>
        ) : (
          <table className="table table-zebra">
            <thead className="sticky top-0 bg-base-100 z-10">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const isMe = myEmail && u.email === myEmail;
                const rowBusy = busyId === u._id;

                return (
                  <tr key={u._id}>
                    <td className="flex items-center gap-3 min-w-[220px]">
                      <div className="avatar">
                        <div className="w-10 rounded-xl overflow-hidden">
                          <img
                            src={u.avatar || defaultAvatar}
                            alt="avatar"
                            className="object-cover"
                            onError={(e) => (e.currentTarget.src = defaultAvatar)}
                          />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.name || "User"}</div>
                        {isMe && <div className="text-xs opacity-60">You</div>}
                      </div>
                    </td>

                    <td className="min-w-[240px]">{u.email}</td>

                    <td>
                      <span className="badge badge-outline capitalize">{u.role}</span>
                    </td>

                    <td>
                      <span
                        className={`badge capitalize ${
                          u.status === "active" ? "badge-success" : "badge-error"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="text-right">
                      {/* ✅ FIX: DaisyUI dropdown needs tabIndex */}
                      <div className="dropdown dropdown-left">
                        <label
                          tabIndex={0}
                          className="btn btn-ghost btn-sm rounded-xl"
                          aria-label="Open user actions"
                        >
                          {rowBusy ? (
                            <span className="loading loading-spinner loading-sm" />
                          ) : (
                            "⋮"
                          )}
                        </label>

                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-xl w-56 border border-base-200"
                        >
                          {/* Block/Unblock */}
                          {u.status === "active" ? (
                            <li>
                              <button
                                disabled={isMe || rowBusy}
                                onClick={() =>
                                  setConfirm({
                                    title: "Block user?",
                                    message: `Block ${u.email}? They will not be able to create requests or donate.`,
                                    action: () =>
                                      onAction(u._id, () => usersApi.blockUser(u._id)),
                                  })
                                }
                              >
                                Block
                              </button>
                            </li>
                          ) : (
                            <li>
                              <button
                                disabled={rowBusy}
                                onClick={() => onAction(u._id, () => usersApi.unblockUser(u._id))}
                              >
                                Unblock
                              </button>
                            </li>
                          )}

                          {/* Make Volunteer */}
                          <li>
                            <button
                              disabled={isMe || rowBusy || u.role === "volunteer" || u.role === "admin"}
                              onClick={() => onAction(u._id, () => usersApi.makeVolunteer(u._id))}
                            >
                              Make Volunteer
                            </button>
                          </li>

                          {/* Make Admin */}
                          <li>
                            <button
                              disabled={isMe || rowBusy || u.role === "admin"}
                              onClick={() =>
                                setConfirm({
                                  title: "Make Admin?",
                                  message: `Make ${u.email} an admin? This gives full access.`,
                                  action: () => onAction(u._id, () => usersApi.makeAdmin(u._id)),
                                })
                              }
                            >
                              Make Admin
                            </button>
                          </li>

                          {isMe && (
                            <li className="mt-1">
                              <span className="text-xs opacity-60 px-3">
                                You can’t manage your own account.
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Modal */}
      <dialog className={`modal ${confirm ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl">
          <h3 className="font-bold text-lg">{confirm?.title}</h3>
          <p className="opacity-70 mt-2">{confirm?.message}</p>

          <div className="modal-action">
            <button
              className="btn btn-ghost rounded-xl"
              onClick={() => setConfirm(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary rounded-xl"
              onClick={() => confirm?.action?.()}
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setConfirm(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AllUsers;
