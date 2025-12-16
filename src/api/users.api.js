import { apiFetch } from "./http";

export const usersApi = {
  // admin stats
  getAdminStats: () => apiFetch(`/admin/stats`),

  // admin all users
  getAllUsers: ({ status }) => apiFetch(`/users?status=${status || ""}`),

  blockUser: (id) => apiFetch(`/users/${id}/block`, { method: "PATCH" }),
  unblockUser: (id) => apiFetch(`/users/${id}/unblock`, { method: "PATCH" }),
  makeVolunteer: (id) => apiFetch(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role: "volunteer" }) }),
  makeAdmin: (id) => apiFetch(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role: "admin" }) }),
};
