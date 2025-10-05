import { useState } from "react";
import { Button, TextInput, Select } from "@gravity-ui/uikit";
import { api } from "../api/client";

export default function Register() {
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [subscription_type, setS] = useState("free");
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await api.post("/register", { username, email, password, subscription_type }); alert("OK"); }}>
      <TextInput value={username} onChange={(e) => setU(e.target.value)} placeholder="Логин" />
      <TextInput value={email} onChange={(e) => setE(e.target.value)} placeholder="Email" />
      <TextInput type="password" value={password} onChange={(e) => setP(e.target.value)} placeholder="Пароль" />
      <Select value={[subscription_type]} onUpdate={(v) => setS(v[0] as string)} options={[{ value: "free" }, { value: "premium" }]} />
      <Button type="submit">Зарегистрироваться</Button>
    </form>
  );
}