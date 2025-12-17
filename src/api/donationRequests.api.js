import { apiFetch } from "./http";

export const donationRequestsApi = {
  getMyRequests: ({ status = "", page = 1, limit = 10 } = {}) =>
    apiFetch(
      `/donation-requests/my?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`
    ),

  getMyRecent: () => apiFetch(`/donation-requests/my-recent`),

  getAllRequests: ({ status = "", page = 1, limit = 10 } = {}) =>
    apiFetch(
      `/admin/donation-requests?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`
    ),

  createRequest: (payload) =>
    apiFetch(`/donation-requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateStatusDonor: (id, status) =>
    apiFetch(`/donation-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  updateStatusAdmin: (id, status) =>
    apiFetch(`/admin/donation-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteRequestDonor: (id) => apiFetch(`/donation-requests/${id}`, { method: "DELETE" }),

  deleteRequestAdmin: (id) => apiFetch(`/admin/donation-requests/${id}`, { method: "DELETE" }),
};
