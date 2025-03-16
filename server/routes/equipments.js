const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.get('/', equipmentController.getAllEquipments);
router.post('/', equipmentController.createEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
