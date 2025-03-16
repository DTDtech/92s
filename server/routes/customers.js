const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get all customers
router.get('/', customerController.getAllCustomers);

// Create new customer
router.post('/', customerController.createCustomer);

// Delete customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
