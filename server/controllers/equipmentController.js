const pool = require('../config/db');

exports.getAllEquipments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipments');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching equipments:', error);
    res.status(500).json({ error: 'Failed to fetch equipments' });
  }
};

exports.createEquipment = async (req, res) => {
  const { name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO equipments 
       (name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Equipment added successfully', 
      equipmentId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM equipments WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};
