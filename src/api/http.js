export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access-token");
  const url = `${import.meta.env.VITE_API_URL}${path}`;

  const headers = {
    ...(options.headers || {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // ✅ token missing/expired -> clean + force re-login behavior
  if (res.status === 401) {
    localStorage.removeItem("access-token");
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
