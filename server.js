
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

// Routes
app.get('/api/stats', (req, res) => {
  const stats = {
    orders: 10,
    equipments: 25,
    upcoming_pickups: 3,
    upcoming_returns: 5
  };
  res.json(stats);
});

app.get('/api/equipments', (req, res) => {
  db.query('SELECT * FROM equipments', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/orders', (req, res) => {
  db.query('SELECT o.*, c.name as customer_name, e.name as equipment_name FROM orders o JOIN customers c ON o.customer_id = c.id JOIN equipments e ON o.equipment_id = e.id', 
    (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(results);
    });
});

app.post('/api/orders', (req, res) => {
  const { customer_id, equipment_id, quantity, rental_start, rental_end } = req.body;
  db.query('INSERT INTO orders SET ?', 
    { customer_id, equipment_id, quantity, rental_start, rental_end },
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: result.insertId });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
