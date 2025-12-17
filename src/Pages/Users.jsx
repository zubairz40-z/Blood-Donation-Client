import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/admin/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

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
                <td>{u.role}</td>
                <td>{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
