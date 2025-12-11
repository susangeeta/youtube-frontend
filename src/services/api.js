import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Set / Remove token
export const setAuthToken = (token) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;
