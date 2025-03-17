const db = require('../config/db');

exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, address, phone_number } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Customer name is required' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO customers (name, address, phone_number) VALUES (?, ?, ?)',
      [name, address || null, phone_number || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Customer added successfully', 
      customerId: result.insertId,
      customer: {
        id: result.insertId,
        name,
        address,
        phone_number
      }
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone_number } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Customer name is required' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE customers SET name = ?, address = ?, phone_number = ? WHERE id = ?',
      [name, address || null, phone_number || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Customer updated successfully',
      customer: {
        id: parseInt(id),
        name,
        address,
        phone_number
      }
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if customer has any orders
    const [orders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?', [id]);
    
    if (orders[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete customer with existing orders. Delete the orders first.' 
      });
    }
    
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
