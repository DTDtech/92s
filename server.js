
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '92s_rental'
});

// Equipment endpoints
app.get('/api/equipments', (req, res) => {
  db.query('SELECT * FROM equipments', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.post('/api/equipments', (req, res) => {
  const { name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price } = req.body;
  db.query('INSERT INTO equipments SET ?', 
    { name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price },
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: result.insertId });
    });
});

// Customer endpoints
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, address, contact, id_card, company_info, reliability } = req.body;
  db.query('INSERT INTO customers SET ?', 
    { name, address, contact, id_card, company_info, reliability },
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: result.insertId });
    });
});

// Order endpoints
app.get('/api/orders', (req, res) => {
  db.query(`
    SELECT o.*, c.name as customer_name, 
    GROUP_CONCAT(e.name, ' (', oe.quantity, ')') as equipment_list
    FROM orders o 
    JOIN customers c ON o.customer_id = c.id 
    JOIN order_equipments oe ON o.id = oe.order_id
    JOIN equipments e ON oe.equipment_id = e.id
    GROUP BY o.id`, 
    (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(results);
    });
});

app.post('/api/orders', (req, res) => {
  const { customer_id, rental_start, rental_end, equipments } = req.body;
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    db.query('INSERT INTO orders SET ?', 
      { customer_id, rental_start, rental_end },
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        const order_id = result.insertId;
        const equipment_values = equipments.map(e => [order_id, e.equipment_id, e.quantity, e.rental_price]);
        
        db.query('INSERT INTO order_equipments (order_id, equipment_id, quantity, rental_price) VALUES ?',
          [equipment_values],
          (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.json({ id: order_id });
            });
          });
      });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
