import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/vouchers";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await http.post("/api/auth/login", {
        userName: username,
        password,
      });

      
      const token = res.data?.token || res.data?.accessToken || res.data?.jwt;
      if (!token) {
        setError("Сервер не вернул token/accessToken");
        return;
      }

      setToken(token);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Неверный логин/пароль или сервер недоступен";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Sign in</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        Токен сохраняется в localStorage и автоматически добавляется в Authorization header.
      </p>
    </div>
  );
}