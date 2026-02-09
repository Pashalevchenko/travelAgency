import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VouchersPage from "./pages/VouchersPage";
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./auth/RequireAuth";
import UsersPage from "./pages/UsersPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/vouchers" element={<VouchersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/vouchers" replace />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
      </Routes>
    </>
  );
}