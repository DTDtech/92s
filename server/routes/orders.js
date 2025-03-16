const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order events for calendar
router.get('/events', orderController.getOrderEvents);

// Create new order
router.post('/', orderController.createOrder);

// Delete order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
