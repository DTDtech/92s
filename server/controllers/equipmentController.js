const db = require('../config/db');

exports.getAllEquipments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipments');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching equipments:', error);
    res.status(500).json({ error: 'Failed to fetch equipments' });
  }
};

exports.createEquipment = async (req, res) => {
  const { name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price } = req.body;
  
  try {
    const [result] = await db.query(
      `INSERT INTO equipments 
       (name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Equipment added successfully', 
      equipmentId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query('DELETE FROM equipments WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};
