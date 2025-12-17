const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/;$/, "");

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access-token");

  const headers = {
    ...(options.headers || {}),
  };

  // Add JSON header only if body exists and Content-Type not already set
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  const ct = res.headers.get("content-type") || "";
  let data;

  if (ct.includes("application/json")) data = await res.json();
  else data = await res.text();

  if (!res.ok) {
    const msg = data?.message || data || "Request failed";
    throw new Error(msg);
  }

  return data;
}
