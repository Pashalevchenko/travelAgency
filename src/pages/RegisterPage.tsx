import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../api/http";

export default function RegisterPage() {
  const [username, setUsername] = useState("bob");
  const [password, setPassword] = useState("123456789");
  const [role, setRole] = useState("USER");
  const [phoneNumber, setPhoneNumber] = useState("380111111111");
  const [error, setError] = useState("");

  
  const location = useLocation();


  const onSubmit = async (e: any) => {
      e.preventDefault();
      setError("");
  
      try {
        const res = await http.post("/api/auth/register", {
          username, 
          password,
          role,
          phoneNumber
        });
      } catch (err) {
        
        setError("Неверный логин/пароль или сервер недоступен");
      }
    };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Register</h2>

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
        <fieldset style={{ border: "none", padding: 0, display: "flex", gap: 15 }}>
          <legend style={{ fontSize: "14px", marginBottom: "5px" }}>Select Role:</legend>
          
          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="role"
              value="ADMIN"
              checked={role === "ADMIN"}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>

          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="role"
              value="MANAGER"
              checked={role === "MANAGER"}
              onChange={(e) => setRole(e.target.value)}
            />
            Manager
          </label>
          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="role"
              value="USER"
              checked={role === "USER"}
              onChange={(e) => setRole(e.target.value)}
            />
            User
          </label>
        </fieldset>
        <input
          placeholder="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="380111111111"
        />

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        Токен сохраняется в localStorage и автоматически добавляется в Authorization header.
      </p>
    </div>
  );    
}