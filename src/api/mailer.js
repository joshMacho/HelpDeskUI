import axios from "axios";

const mailerApi = axios.create({
  baseURL: import.meta.env.VITE_API_MAIL_URL,
  withCredentials: true,
});

mailerApi.interceptors.request.use((config) => {
  // get token from URL query params
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    // validate token with backend
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default mailerApi;
