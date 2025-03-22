const pool = require('../config/db');

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
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

    const rows = result.rows; 

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
    const result = await pool.query(`
      SELECT o.id, c.name AS customer, e.name AS equipment, oe.quantity, o.rental_start, o.rental_end 
      FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      JOIN order_equipments oe ON o.id = oe.order_id
      JOIN equipments e ON oe.equipment_id = e.id
    `);

    const rows = result.rows;

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

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Handle new customer if needed
    let customerId = customer_id;
    if (customer_id.startsWith('new:')) {
      const customerName = customer_id.substring(4);
      const insertCustomerText = 'INSERT INTO customers (name) VALUES ($1)';
      const insertCustomerValue = [customerName];
      await client.query(insertCustomerText, insertCustomerValue);
    }

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, rental_start, rental_end) VALUES ($1, $2, $3) RETURNING id',
      [customerId, rental_start, rental_end]
    );

    const orderId = orderResult.rows[0].id;

    // Add equipment to order
    for (const item of equipment) {
      const insertEquipmentText = `INSERT INTO order_equipments 
         (order_id, equipment_id, quantity, rental_price) 
         VALUES ($1, $2, $3, $4)`;
      const insertEquipmentValue = [
        orderId,
        item.equipment_id,
        item.quantity,
        item.calculated_price
      ]
      await client.query(insertEquipmentText, insertEquipmentValue);
    }

    await client.query('COMMIT')
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query('BEGIN');

    // Delete related equipment entries first
    await client.query('DELETE FROM order_equipments WHERE order_id = $1', [id]);

    // Delete the order
    const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Order deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  } finally {
    client.release(); // Release the client back to the pool
  }
};