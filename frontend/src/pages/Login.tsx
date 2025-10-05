import { useState } from "react";
import { Button, TextInput } from "@gravity-ui/uikit";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await login(username, password); }}>
      <TextInput value={username} onChange={(e) => setU(e.target.value)} placeholder="Логин" />
      <TextInput type="password" value={password} onChange={(e) => setP(e.target.value)} placeholder="Пароль" />
      <Button type="submit">Войти</Button>
    </form>
  );
}