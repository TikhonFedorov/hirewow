import { useState } from "react";
import { api, setAuth } from "../api/client";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  async function login(username: string, password: string) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const res = await api.post("/login", form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    const t = res.data.access_token as string;
    localStorage.setItem("token", t);
    setToken(t);
    setAuth(t);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuth(null);
  }

  return { token, login, logout };
}