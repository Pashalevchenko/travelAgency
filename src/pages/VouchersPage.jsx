import React, { useEffect, useState, useCallback } from 'react';
import { http } from '../api/http';
import { getJwtPayload } from '../auth/authToken';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  Pagination,
} from 'react-bootstrap';
import { api } from '../api/api';

export default function VouchersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorBalance, setErrorBalance] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userVoucher, setUserVoucher] = useState();

  const [filters, setFilters] = useState({
    tourType: '',
    transferType: '',
    hotelType: '',
    price: '',
  });

  const payload = getJwtPayload();
  const isAdmin = payload?.roles?.includes('ADMIN') || payload?.role === 'ADMIN';

  const loadVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      };

      const res = await http.get('/api/vouchers', { params });

      const user = await http.get('/api/users/' + payload.userId);
      setUserVoucher(user?.data?.vouchers);

      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (e) {
      setError('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(0);
  };

  const handleOrderClick = async (id) => {
    try {
      await http.post('/api/vouchers/order/' + payload?.userId, { id: id });

      window.dispatchEvent(new Event('balanceUpdated'));

      const purchasedVoucher = items.find((v) => v.id === id);

      if (purchasedVoucher) {
        setUserVoucher((prev) => [...(prev || []), purchasedVoucher]);
      }
    } catch (e) {
      setErrorBalance(e?.response?.data?.message);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    try {
      await http.delete(`/api/vouchers/${voucherId}`);

      setItems((prevItems) => prevItems.filter((v) => v.id !== voucherId));
    } catch (e) {
      console.error(e);
    }
  };

  const handlechangeStatus = async (voucherID) => {
    try {
      const res = await http.post(`/api/vouchers/${voucherID}/hot`);

      const updatedVoucher = res.data;

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === voucherID) {
            return {
              ...item,
              isHot: updatedVoucher.isHot,
            };
          }
          return item;
        }),
      );
    } catch (e) {
      console.error('err:', e);
    }
  };

  return (
    <Container className="py-4">
      <h2>Available Vouchers</h2>

      <Card className="mb-4 shadow-sm border-0 bg-light">
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tour Type</Form.Label>
                  <Form.Select
                    name="tourType"
                    value={filters.tourType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="SPORTS">Sports</option>
                    <option value="WINE">Wine</option>
                    <option value="ECO">Eco</option>
                    <option value="ADVENTURE">Adventure</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Transfer</Form.Label>
                  <Form.Select
                    name="transferType"
                    value={filters.transferType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Transfer</option>
                    <option value="BUS">Bus</option>
                    <option value="TRAIN">Train</option>
                    <option value="PLANE">Plane</option>
                    <option value="SHIP">Ship</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Hotel</Form.Label>
                  <Form.Select
                    name="hotelType"
                    value={filters.hotelType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Hotel</option>
                    <option value="ONE_STAR">1 Star</option>
                    <option value="TWO_STARS">2 Stars</option>
                    <option value="THREE_STARS">3 Stars</option>
                    <option value="FOUR_STARS">4 Stars</option>
                    <option value="FIVE_STARS">5 Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Exact Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="e.g. 700"
                    value={filters.price}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 text-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setFilters({ tourType: '', transferType: '', hotelType: '', price: '' })
                }
              >
                Reset Filters
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {errorBalance && (
        <Alert variant="danger" onClose={() => setErrorBalance(false)} dismissible>
          <Alert.Heading>Ops...! Not enogh many</Alert.Heading>
          <p>Just work and one day you will chill 😌🏝️</p>
        </Alert>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row xs={1} md={3} className="g-4">
          {items.map((v) => (
            <Col key={v.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{v.title ?? 'No title'}</Card.Title>
                    {(v.isHot || v.hot) && <Badge bg="danger">Hot</Badge>}
                  </div>

                  <Card.Subtitle className="mb-3 text-success fw-bold">${v.price}</Card.Subtitle>
                  <Card.Body>
                    <Card.Text className="text-muted">{v.description}</Card.Text>
                  </Card.Body>

                  <div className="small text-muted mb-3 flex-grow-1">
                    <div>🏨 {v.hotelType}</div>
                    <div>🌍 {v.tourType}</div>
                    <div>✈️ {v.transferType}</div>
                    <div>📅 {v.arrivalDate}</div>
                  </div>

                  <div className="mt-auto">
                    {isAdmin ? (
                      <>
                        <Button
                          variant="danger"
                          className="w-100"
                          onClick={() => handleDeleteVoucher(v.id)}
                        >
                          🗑 Delete Voucher
                        </Button>
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => handlechangeStatus(v.id)}
                        >
                          Change status
                        </Button>
                      </>
                    ) : (
                      <>
                        {userVoucher?.some((uv) => uv.id === v.id) ? (
                          <Button variant="secondary" className="w-100 mb-2" disabled>
                            ✓ Add to list
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-100 mb-2"
                            onClick={() => handleOrderClick(v.id)}
                          >
                            Order Now
                          </Button>
                        )}

                        {payload?.userId === v.userId && (
                          <Button
                            variant="link"
                            className="text-danger w-100 text-decoration-none"
                            onClick={() => handleDeleteVoucher(v.id)}
                          >
                            Delete My Voucher
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
          {[...Array(totalPages).keys()].map((num) => (
            <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
              {num + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}
    </Container>
  );
}
