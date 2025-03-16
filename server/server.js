require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const orderRoutes = require('./routes/orders');
const equipmentRoutes = require('./routes/equipments');
const customerRoutes = require('./routes/customers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/customers', customerRoutes);

// Root route for API health check
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// In development, React runs on a different port (3000) via react-scripts
// In production, we serve the static React build
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} 
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
