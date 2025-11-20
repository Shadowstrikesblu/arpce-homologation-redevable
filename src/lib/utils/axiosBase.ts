// src/lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'],
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storageKey =
        process.env['NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY'] || "auth_token";

      const token = localStorage.getItem(storageKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
