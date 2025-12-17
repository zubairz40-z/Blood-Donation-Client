const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/;$/, "");

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access-token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.authorization = `Bearer ${token}`; // ✅ attach token

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // try to parse json safely
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const message =
      (data && data.message) ||
      `Request failed (${res.status})`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
