const pool = require('../config/db');

exports.getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY name');
    res.json(result.rows);
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
    const result = await pool.query(
      'INSERT INTO customers (name, address, phone_number) VALUES ($1, $2, $3) RETURNING id',
      [name, address || null, phone_number || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Customer added successfully', 
      customerId: result.rows[0].id,
      customer: {
        id: result.rows[0].id,
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
    const result = await pool.query(
      'UPDATE customers SET name = $1, address = $2, phone_number = $3 WHERE id = $4 RETURNING *',
      [name, address || null, phone_number || null, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Customer updated successfully',
      customer: result.rows[0]
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
    const result = await pool.query('SELECT COUNT(*) FROM orders WHERE customer_id = $1', [id]);
    
    if (parseInt(result.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete customer with existing orders. Delete the orders first.' 
      });
    }
    
    const deleteResult = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
