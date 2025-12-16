import axiosSecure from "./axiosSecure";

export const usersApi = {
  // ---------------- Auth/Profile ----------------
  async getMe() {
    const { data } = await axiosSecure.get("/users/me");
    return data;
  },

  async updateMe(payload) {
    const { data } = await axiosSecure.patch("/users/me", payload);
    return data;
  },

  // ---------------- Admin/Volunteer Dashboard Stats ----------------
  async getAdminStats() {
    const { data } = await axiosSecure.get("/admin/stats");
    return data;
  },

  // ---------------- Admin: Users Management ----------------
  async getAllUsers(params = {}) {
    // backend: GET /admin/users?status=active|blocked
    const { data } = await axiosSecure.get("/admin/users", { params });
    return data; // array
  },

  async blockUser(id) {
    // backend: PATCH /admin/users/:id/block
    const { data } = await axiosSecure.patch(`/admin/users/${id}/block`);
    return data;
  },

  async unblockUser(id) {
    // backend: PATCH /admin/users/:id/unblock
    const { data } = await axiosSecure.patch(`/admin/users/${id}/unblock`);
    return data;
  },

  async makeVolunteer(id) {
    // backend: PATCH /admin/users/:id/make-volunteer
    const { data } = await axiosSecure.patch(`/admin/users/${id}/make-volunteer`);
    return data;
  },

  async makeAdmin(id) {
    // backend: PATCH /admin/users/:id/make-admin
    const { data } = await axiosSecure.patch(`/admin/users/${id}/make-admin`);
    return data;
  },
};
