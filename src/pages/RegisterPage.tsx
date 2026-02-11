import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

export default function RegisterPage() {
  const [username, setUsername] = useState('bob');
  const [password, setPassword] = useState('1234567890');
  const [role, setRole] = useState('USER');
  const [phoneNumber, setPhoneNumber] = useState('380111111111');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/api/auth/register', {
        username,
        password,
        role,
        phoneNumber,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '90vh' }}
    >
      <Card style={{ width: '100%', maxWidth: '450px' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Create Account</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pick a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Min. 10 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="380..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 py-2 fw-bold">
              Register Now
            </Button>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account?{' '}
                <a href="/login" className="text-decoration-none">
                  Sign In
                </a>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
