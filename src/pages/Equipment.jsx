
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export default function Equipment() {
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', quantity: '',
    hourly_price: '', daily_price: '', weekly_price: '', monthly_price: ''
  });

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    const response = await fetch('/api/equipments');
    const data = await response.json();
    setEquipments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/equipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchEquipments();
  };

  return (
    <div className="container mt-4">
      <h1>Equipment Management</h1>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Add Equipment
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Pricing</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map(equipment => (
            <tr key={equipment.id}>
              <td>{equipment.name}</td>
              <td>{equipment.description}</td>
              <td>{equipment.quantity}</td>
              <td>
                <div>Hourly: ${equipment.hourly_price}</div>
                <div>Daily: ${equipment.daily_price}</div>
                <div>Weekly: ${equipment.weekly_price}</div>
                <div>Monthly: ${equipment.monthly_price}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hourly Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.hourly_price}
                onChange={(e) => setFormData({...formData, hourly_price: e.target.value})}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
