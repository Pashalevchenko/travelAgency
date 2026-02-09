import React, { useEffect, useState } from "react";
import { http } from "../api/http";
import { getJwtPayload } from "../auth/authToken";

// Импорты Bootstrap
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function ProfilePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);


  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ username: "", phoneNumber: "" });

  const payload = getJwtPayload();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await http.get("/api/users/" + payload.userId);
        if (alive) {
          setUser(res.data);
          setEditData({ 
            username: res.data.username, 
            phoneNumber: res.data.phoneNumber || "" 
          });
        }
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || "err");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [refresh, payload.userId]);

  const handleVoucherClick = (id) => {
    http.delete("/api/users/" + payload.userId + "/voucher/" + id)
      .then(() => {
        setRefresh(prev => prev + 1);
        window.dispatchEvent(new Event("balanceUpdated"));
      });
      
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
    
      const res = await http.put(`/api/users/${user.username}`, {
        ...user, 
        username: editData.username,
        phoneNumber: editData.phoneNumber
      });
      setUser(res.data);
      setShowEditModal(false);
      setRefresh(prev => prev + 1); 
    } catch (err) {
      
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">My Profile</h2>
            
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}

          {user && (
            <>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">User Information</Card.Title>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span><strong>Username:</strong> {user?.username}</span>
                    <Badge bg="info">{user?.role}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Balance:</strong> <span className="text-success fw-bold">${user?.balance}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span><strong>Phone Number:</strong> {user?.phoneNumber || "Not set"}</span>
                    <Button variant="outline-primary" size="sm" onClick={() => setShowEditModal(true)}>
                    Phone Number 
                     </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <h4 className="mb-3">My Vouchers</h4>
              {user.vouchers && user.vouchers.length > 0 ? (
                user.vouchers.map((voucher) => (
                  <Card key={voucher.id} className="mb-3 border-start border-primary border-4 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col sm={8}>
                          <h5 className="text-primary">{voucher.title}</h5>
                          <p className="text-muted small mb-2">{voucher.description}</p>
                          <Row className="small">
                            <Col xs={6}>🏨 {voucher.hotelType}</Col>
                            <Col xs={6}>💰 ${voucher.price}</Col>
                            <Col xs={6}>✈️ {voucher.transferType}</Col>
                            <Col xs={6}>📅 {voucher.arrivalDate}</Col>
                          </Row>
                          <Badge bg="secondary" className="mt-2">{voucher.status}</Badge>
                        </Col>
                        <Col sm={4} className="text-end mt-3 mt-sm-0">
                          <Button variant="outline-danger" size="sm" onClick={() => handleVoucherClick(voucher.id)}>
                            Delete Voucher
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="light" className="text-center border">You don't have any vouchers yet.</Alert>
              )}
            </>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit phone number</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProfile}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text"
                value={editData.phoneNumber}
                onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                placeholder="380..."
              />
            </Form.Group>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}