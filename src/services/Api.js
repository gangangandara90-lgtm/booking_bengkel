import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("booking_bengkel_user");
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

export default api;
