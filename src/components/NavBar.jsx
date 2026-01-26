import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getJwtPayload } from "../auth/authToken";

export default function NavBar() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  console.log(getJwtPayload())
  
  
  const payload = getJwtPayload();

  return (
    <div style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/vouchers">Vouchers</Link>
      <Link to="/profile">Profile</Link>
      

      <div style={{ marginLeft: "auto" }}>
        {isAuthed ? (
          <ul style={{display:"flex"}}>
            <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
          <p>Hello, {payload?.sub}</p>
          </ul>
          
        ) : (
          <ul>
            <Link to="/register">Register</Link> 
            <Link to="/login" style={{paddingLeft: "10px"}}>Login</Link>
          </ul>
          
          
        )}
        
        
      </div>
    </div>
  );
}