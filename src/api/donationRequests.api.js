import { apiFetch } from "./http";

export const donationRequestsApi = {
  // donor: only my requests
  getMyRequests: ({ email, status, page, limit }) =>
    apiFetch(`/donation-requests/my?email=${email}&status=${status || ""}&page=${page}&limit=${limit}`),

  // donor dashboard home: 3 recent
  getMyRecent: ({ email }) =>
    apiFetch(`/donation-requests/my-recent?email=${email}&limit=3`),

  // admin/volunteer: all requests
  getAllRequests: ({ status, page, limit }) =>
    apiFetch(`/donation-requests?status=${status || ""}&page=${page}&limit=${limit}`),

  createRequest: (payload) =>
    apiFetch(`/donation-requests`, { method: "POST", body: JSON.stringify(payload) }),

  updateStatus: (id, status) =>
    apiFetch(`/donation-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  deleteRequest: (id) =>
    apiFetch(`/donation-requests/${id}`, { method: "DELETE" }),
};
