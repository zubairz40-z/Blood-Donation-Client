import axios from "axios";

const axiosSecure = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/;$/, ""),
  timeout: 15000,
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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
