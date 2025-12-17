import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load users error:", err?.response?.data || err?.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Make Volunteer / Admin
  const handleChangeRole = async (id, role) => {
    try {
      await axiosSecure.patch(`/admin/users/${id}/role`, { role });

      // update UI instantly
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
    } catch (err) {
      console.error("Role update error:", err?.response?.data || err?.message);
      // if you want: reload to be safe
      // loadUsers();
    }
  };

  // ✅ Block / Unblock
  const handleChangeStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/admin/users/${id}/status`, { status });

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status } : u))
      );
    } catch (err) {
      console.error("Status update error:", err?.response?.data || err?.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button onClick={loadUsers} className="btn btn-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Blood</th>
                <th>District</th>
                <th>Upazila</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id || u.email || idx}>
                  <td>{idx + 1}</td>

                  <td>
                    <img
                      src={u.avatar || ""}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover bg-base-200"
                      referrerPolicy="no-referrer"
                    />
                  </td>

                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.bloodGroup || "—"}</td>
                  <td>{u.district || "—"}</td>
                  <td>{u.upazila || "—"}</td>
                  <td className="capitalize">{u.role}</td>
                  <td className="capitalize">{u.status}</td>

                  <td className="space-x-2">
                    {/* donor -> volunteer */}
                    {u.role === "donor" && (
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => handleChangeRole(u._id, "volunteer")}
                      >
                        Make Volunteer
                      </button>
                    )}

                    {/* anyone -> admin (except admin already) */}
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => handleChangeRole(u._id, "admin")}
                      >
                        Make Admin
                      </button>
                    )}

                    {/* block / unblock */}
                    {u.status === "active" ? (
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleChangeStatus(u._id, "blocked")}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handleChangeStatus(u._id, "active")}
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
