const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.id AS order_id,
        c.name AS customer,
        o.rental_start,
        o.rental_end,
        e.name AS equipment_name,
        oe.quantity,
        oe.rental_price,
        (oe.quantity * oe.rental_price) AS item_total
      FROM
        orders o
      JOIN
        customers c ON o.customer_id = c.id
      JOIN
        order_equipments oe ON o.id = oe.order_id
      JOIN
        equipments e ON oe.equipment_id = e.id
      ORDER BY
        o.id, e.name
    `);

    // Group the results by order
    const ordersMap = new Map();
    
    rows.forEach(row => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          customer: row.customer,
          rental_start: row.rental_start,
          rental_end: row.rental_end,
          equipment_items: [],
          total_price: 0
        });
      }
      
      const order = ordersMap.get(row.order_id);
      
      // Add equipment item
      order.equipment_items.push({
        name: row.equipment_name,
        quantity: row.quantity,
        rental_price: row.rental_price,
        item_total: row.item_total
      });
      
      // Update total price
      order.total_price += row.item_total;
    });
    
    // Convert map to array
    const orders = Array.from(ordersMap.values());
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
exports.getOrderEvents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, c.name as customer, e.name as equipment, oe.quantity, o.rental_start, o.rental_end 
      FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      JOIN order_equipments oe ON o.id = oe.order_id
      JOIN equipments e ON oe.equipment_id = e.id
    `);
    
    const events = rows.map(row => ({
      id: row.id,
      title: `${row.customer} - ${row.equipment} (${row.quantity})`,
      start: row.rental_start,
      end: row.rental_end,
      allDay: true,
      backgroundColor: '#007bff',
      borderColor: '#0056b3'
    }));
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.createOrder = async (req, res) => {
  const { customer_id, rental_start, rental_end, equipment } = req.body;
  
  if (!customer_id || !rental_start || !rental_end || !equipment || !equipment.length) {
    return res.status(400).json({ 
      error: 'Missing required fields: customer, rental dates, or equipment' 
    });
  }
  
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    // Handle new customer if needed
    let customerId = customer_id;
    if (customer_id.startsWith('new:')) {
      const customerName = customer_id.substring(4);
      const [result] = await connection.query(
        'INSERT INTO customers (name) VALUES (?)',
        [customerName]
      );
      customerId = result.insertId;
    }
    
    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, rental_start, rental_end) VALUES (?, ?, ?)',
      [customerId, rental_start, rental_end]
    );
    
    const orderId = orderResult.insertId;
    
    // Add equipment to order
    for (const item of equipment) {
      await connection.query(
        `INSERT INTO order_equipments 
         (order_id, equipment_id, quantity, rental_price) 
         VALUES (?, ?, ?, ?)`,
        [
          orderId, 
          item.equipment_id, 
          item.quantity, 
          item.calculated_price
        ]
      );
    }
    
    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully', 
      orderId 
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    if (connection) connection.release();
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    // Delete related equipment entries first
    await connection.query('DELETE FROM order_equipments WHERE order_id = ?', [id]);
    
    // Delete the order
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await connection.commit();
    res.json({ success: true, message: 'Order deleted successfully' });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  } finally {
    if (connection) connection.release();
  }
};