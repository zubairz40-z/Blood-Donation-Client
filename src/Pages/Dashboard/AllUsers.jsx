import React, { useEffect, useState } from "react";
import { usersApi } from "../../api/users.api";

const AllUsers = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAllUsers({ status });
      setUsers(Array.isArray(res) ? res : res.items || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Users</h1>
          <p className="opacity-70 text-sm">Manage roles and user status.</p>
        </div>

        <select className="select select-bordered rounded-xl" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="active">active</option>
          <option value="blocked">blocked</option>
        </select>
      </div>

      <div className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6 flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span className="opacity-70">Loading users...</span>
          </div>
        ) : (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-xl">
                        <img src={u.avatar || "https://i.ibb.co/2M7rtLk/default-avatar.png"} alt="avatar" />
                      </div>
                    </div>
                    <span className="font-medium">{u.name || "User"}</span>
                  </td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-outline">{u.role}</span></td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "badge-success" : "badge-error"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-sm">⋮</button>
                      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-xl w-52">
                        {u.status === "active" ? (
                          <li><button onClick={async () => { await usersApi.blockUser(u._id); load(); }}>Block</button></li>
                        ) : (
                          <li><button onClick={async () => { await usersApi.unblockUser(u._id); load(); }}>Unblock</button></li>
                        )}
                        <li><button onClick={async () => { await usersApi.makeVolunteer(u._id); load(); }}>Make Volunteer</button></li>
                        <li><button onClick={async () => { await usersApi.makeAdmin(u._id); load(); }}>Make Admin</button></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
