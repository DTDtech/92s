const express = require('express');
const router = express.Router();
const handoverController = require('../controllers/handoverController');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory (buffer)
const upload = multer({ storage });

// Get all handovers
router.get('/', handoverController.getAllHandovers);

// Get a single handover by ID
router.get('/:id', handoverController.getHandoverById);

// Create a new handover (Multiple images)
router.post(
    '/',
    upload.fields([
        { name: 'customer_document_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 }
    ]),
    handoverController.createHandover
);

// Update a handover
router.put(
    '/:id',
    upload.fields([
        { name: 'customer_document_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 }
    ]),
    handoverController.updateHandover
);

// Delete a handover
router.delete('/:id', handoverController.deleteHandover);

module.exports = router;
