import axiosSecure from "./axiosSecure";

export const usersApi = {
  async getMe() {
    const { data } = await axiosSecure.get("/users/me");
    return data;
  },

  async updateMe(payload) {
    const { data } = await axiosSecure.patch("/users/me", payload);
    return data;
  },

  async getAdminStats() {
    const { data } = await axiosSecure.get("/admin/stats");
    return data;
  },

  async getAllUsers(params = {}) {
    const { data } = await axiosSecure.get("/admin/users", { params });
    return data;
  },

  async blockUser(id) {
    const { data } = await axiosSecure.patch(`/admin/users/${id}/block`);
    return data;
  },

  async unblockUser(id) {
    const { data } = await axiosSecure.patch(`/admin/users/${id}/unblock`);
    return data;
  },

  async makeVolunteer(id) {
    const { data } = await axiosSecure.patch(`/admin/users/${id}/make-volunteer`);
    return data;
  },

  async makeAdmin(id) {
    const { data } = await axiosSecure.patch(`/admin/users/${id}/make-admin`);
    return data;
  },
};
