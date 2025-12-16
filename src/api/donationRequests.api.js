import { apiFetch } from "./http";

export const donationRequestsApi = {
  // ✅ Donor: my requests (filter + pagination)
  getMyRequests: ({ status = "", page = 1, limit = 10 } = {}) =>
    apiFetch(`/donation-requests/my?status=${status}&page=${page}&limit=${limit}`),

  // ✅ Donor dashboard home: 3 recent
  getMyRecent: () => apiFetch(`/donation-requests/my-recent`),

  // ✅ Admin/Volunteer: all requests
  getAllRequests: ({ status = "", page = 1, limit = 10 } = {}) =>
    apiFetch(`/admin/donation-requests?status=${status}&page=${page}&limit=${limit}`),

  // ✅ Create request (private)
  createRequest: (payload) =>
    apiFetch(`/donation-requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ✅ Donor status update (owner only)
  updateStatusDonor: (id, status) =>
    apiFetch(`/donation-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // ✅ Admin/Volunteer status update (any request)
  updateStatusAdmin: (id, status) =>
    apiFetch(`/admin/donation-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // ✅ Donor delete (owner only)
  deleteRequestDonor: (id) =>
    apiFetch(`/donation-requests/${id}`, { method: "DELETE" }),

  // ✅ Admin delete (any request)
  deleteRequestAdmin: (id) =>
    apiFetch(`/admin/donation-requests/${id}`, { method: "DELETE" }),
};
