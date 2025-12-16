import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ attach token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    config.headers = config.headers || {}; // ✅ safety

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ optional: handle auth errors globally
axiosSecure.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("access-token");
      // if you want auto redirect:
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;