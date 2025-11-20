// src/lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'],
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storageKey =
        process.env['NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY'];

      const token = localStorage.getItem(storageKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {

    if (typeof window !== "undefined") {
        const storageKey = process.env["NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY"];

        if (response?.data?.token) {
        localStorage.setItem(storageKey, response.data.token);
        }
    }

    return response;

  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
