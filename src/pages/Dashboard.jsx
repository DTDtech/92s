
import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row>
        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h3>Orders</h3>
              <p className="fs-1">{stats.orders}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body>
              <h3>Equipment</h3>
              <p className="fs-1">{stats.equipments}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning">
            <Card.Body>
              <h3>Upcoming Pickups</h3>
              <p className="fs-1">{stats.upcoming_pickups}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-danger text-white">
            <Card.Body>
              <h3>Upcoming Returns</h3>
              <p className="fs-1">{stats.upcoming_returns}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h2>Stats Overview</h2>
            </Card.Header>
            <Card.Body>
              <Pie data={{
                labels: ['Orders', 'Equipment', 'Pickups', 'Returns'],
                datasets: [{
                  data: [
                    stats.orders,
                    stats.equipments,
                    stats.upcoming_pickups,
                    stats.upcoming_returns
                  ],
                  backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
                }]
              }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
