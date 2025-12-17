import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// ✅ attach JWT from localStorage
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ if 401 happens, clear token so UI doesn't hang forever
axiosSecure.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access-token");
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
