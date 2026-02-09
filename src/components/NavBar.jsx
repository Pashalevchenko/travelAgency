import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getJwtPayload } from "../auth/authToken";
import { useTranslation } from "react-i18next";
import { http } from "../api/http";


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavBar() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const payload = getJwtPayload();
  const { i18n, t } = useTranslation();
  const [wallet, setWallet] = useState();



  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

   useEffect(() => {

  fetchUsers();


  const handleUpdate = () => {
    console.log("Balance update event received!");
    fetchUsers();
  };

  window.addEventListener("balanceUpdated", handleUpdate);

  return () => {
    window.removeEventListener("balanceUpdated", handleUpdate);
  };
}, [payload?.userId]);
  
    const fetchUsers = async () => {
      try {
        
        const res = await http.get("/api/users/" + payload.userId);
        setWallet(res.data.balance);
      } catch (e) {
        console.log(e)
      } 
    };

    console.log(wallet)

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="mb-4 shadow-sm">
      <Container>
        
        <Navbar.Brand as={Link} to="/">Travel Agency</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/vouchers">Vouchers</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
             {(payload?.role === "ADMIN" || payload?.role === "MANAGER") && (
                <Nav.Link as={Link} to="/users">Users Control</Nav.Link>
              )}
              
          </Nav>

          <Nav className="align-items-center">
        
            <NavDropdown title={i18n.language.toUpperCase()} id="lang-dropdown">
              <NavDropdown.Item onClick={() => changeLang("en")}>EN</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLang("ua")}>UA</NavDropdown.Item>
            </NavDropdown>

            {isAuthed ? (
              <>
                <Navbar.Text className="me-3">
                  Hello, <b>{payload?.sub}</b>
                </Navbar.Text>
                {payload.role !== "ADMIN" && 
                <Navbar.Text className="me-3">
                 Your balance: <b>{wallet}$</b>
                </Navbar.Text>
                }
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
               
              </>
            )}
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}