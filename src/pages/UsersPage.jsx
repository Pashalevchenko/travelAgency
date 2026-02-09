import React, { useEffect, useState } from "react";
import { http } from "../api/http";
import { getJwtPayload } from "../auth/authToken";

// Импорты Bootstrap
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const payload = getJwtPayload();
  const isAdmin = payload?.role === "ADMIN";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await http.get("/api/users");
      setUsers(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    
      try {
        await http.delete(`/api/users/${userId}`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (e) {
        
      }
    
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <Badge bg="secondary">Total: {users.length}</Badge>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table hover responsive className="shadow-sm bg-white mt-3">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Balance</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.phoneNumber || "-"}</td>
                <td>
                  <Badge bg={u.role === "ADMIN" ? "danger" : u.role === "MANAGER" ? "warning" : "info"}>
                    {u.role}
                  </Badge>
                </td>
                <td className="fw-bold text-success">${u.balance}</td>
                {isAdmin && (
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === payload.userId}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            
          </tbody>
          
        </Table>
      )}
    </Container>
  );
}