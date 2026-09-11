import axios from "axios";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.credentials?.token;

  // Don't overwrite an Authorization header explicitly
  // supplied by the request (e.g. Microsoft access token).
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
