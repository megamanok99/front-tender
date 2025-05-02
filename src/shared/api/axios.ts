import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWE1OGJjYjY5OGUwM2Q4MjcxZmU4NTViZjgxNmQyOSIsIm5iZiI6MTY1NjYzNTI4Ni44ODgsInN1YiI6IjYyYmUzZjk2NTMyYWNiMDA0ZDBjODY3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6JH1WPSRypyEX5-T-vg71fBI5fHD8ipGPd9kb4fMvEg",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export const GET = <T>(url: string, config?: AxiosRequestConfig) =>
  apiInstance.get<T>(url, config).then((res) => res.data);

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiInstance.post<T>(url, data, config).then((res) => res.data);

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiInstance.put<T>(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiInstance.delete<T>(url, config).then((res) => res.data);
