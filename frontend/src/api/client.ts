// src/api/client.ts
import axios, { AxiosError } from "axios";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api"
});

// Helper function to clear auth and redirect to login
function clearAuthAndRedirect() {
  localStorage.removeItem("access_token");
  delete api.defaults.headers.common["Authorization"];
  // Only redirect if we're not already on login/register page
  if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
    window.location.href = "/login";
  }
}

// Initialize auth token from localStorage on startup
const initialToken = localStorage.getItem("access_token");
if (initialToken) {
  // Check if token is expired before using it
  if (isTokenExpired(initialToken)) {
    clearAuthAndRedirect();
  } else {
    api.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
  }
}

// Add request interceptor to always use the latest token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    // Check token expiration before each request
    if (isTokenExpired(token)) {
      clearAuthAndRedirect();
      return Promise.reject(new Error("Token expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Add response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear auth and redirect
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

export function setAuth(token: string | null) {
  if (token) {
    // Validate token before setting it
    if (isTokenExpired(token)) {
      console.warn("Attempted to set expired token");
      clearAuthAndRedirect();
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("access_token");
  }
}