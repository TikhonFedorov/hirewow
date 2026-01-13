import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setAuth } from "../api/client";
import { isTokenExpired } from "../utils/jwt";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export function useAuth() {
  // Always read from localStorage to get the current value
  const getToken = useCallback(() => {
    const token = localStorage.getItem("access_token");
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      return null;
    }
    return token;
  }, []);
  
  const [token, setToken] = useState<string | null>(getToken());
  const navigate = useNavigate();
  const location = useLocation();

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiry = () => {
      const currentToken = getToken();
      if (currentToken !== token) {
        setToken(currentToken);
        if (!currentToken) {
          // Token expired, redirect to login
          navigate("/login", { replace: true });
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [token, getToken, navigate]);

  async function login(username: string, password: string) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const res = await axios.post(`${API_BASE}/login`, form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const t = res.data.access_token as string;
    localStorage.setItem("access_token", t);
    setToken(t);
    setAuth(t);
    // Redirect to saved location or default to /hub
    const from = location.state?.from?.pathname || "/hub";
    navigate(from, { replace: true });
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setAuth(null);
    navigate("/login", { replace: true });
  }

  // Always return current token from localStorage (with expiration check)
  return { token: getToken(), login, logout };
}