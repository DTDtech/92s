const pool = require('../config/db');

// Get all handovers
exports.getAllHandovers = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        h.*, 
        json_agg(
          json_build_object(
            'id', e.id,
            'name', e.name,
            'quantity', ei.quantity,
            'condition', ei.condition
          )
        ) AS equipment_items
      FROM handovers h
      LEFT JOIN handover_equipment_items ei ON h.id = ei.handover_id
      LEFT JOIN equipments e ON ei.equipment_id = e.id
      GROUP BY h.id
      ORDER BY h.handover_date DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching handovers:', error);
        res.status(500).json({ error: 'Failed to fetch handovers' });
    }
};

// Get a single handover by ID
exports.getHandoverById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
      SELECT 
        h.*, 
        json_agg(
          json_build_object(
            'id', e.id,
            'name', e.name,
            'quantity', ei.quantity,
            'condition', ei.condition
          )
        ) AS equipment_items
      FROM handovers h
      LEFT JOIN handover_equipment_items ei ON h.id = ei.handover_id
      LEFT JOIN equipments e ON ei.equipment_id = e.id
      WHERE h.id = $1
      GROUP BY h.id
      `,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Handover not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching handover:', error);
        res.status(500).json({ error: 'Failed to fetch handover' });
    }
};

// Create a new handover
exports.createHandover = async (req, res) => {
    const {
        handover_date,
        status,
        customer_document_image,
        equipment_images,
        personal_document_note,
        document_note,
        equipment_items,
    } = req.body;

    console.log('handover_date:', handover_date);
    console.log('status:', status);
    console.log('equipment_items:', equipment_items);

    if (!handover_date || !status || !equipment_items || equipment_items.length === 0) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Insert the handover
        const handoverResult = await pool.query(
            `
      INSERT INTO handovers 
        (handover_date, status, customer_document_image, equipment_images, personal_document_note, document_note)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
            [handover_date, status, customer_document_image, equipment_images, personal_document_note, document_note]
        );

        const handoverId = handoverResult.rows[0].id;

        // Insert equipment items
        for (const item of equipment_items) {
            await pool.query(
                `
        INSERT INTO handover_equipment_items 
          (handover_id, equipment_id, quantity, condition)
        VALUES ($1, $2, $3, $4)
        `,
                [handoverId, item.equipment_id, item.quantity, item.condition]
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Handover created successfully',
            handoverId,
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await pool.query('ROLLBACK');
        console.error('Error creating handover:', error);
        res.status(500).json({ error: 'Failed to create handover' });
    }
};

// Update a handover
exports.updateHandover = async (req, res) => {
    const { id } = req.params;
    const {
        handover_date,
        status,
        customer_document_image,
        equipment_images,
        personal_document_note,
        document_note,
        equipment_items,
    } = req.body;

    if (!handover_date || !status || !equipment_items || equipment_items.length === 0) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Update the handover
        const handoverResult = await pool.query(
            `
      UPDATE handovers
      SET 
        handover_date = $1,
        status = $2,
        customer_document_image = $3,
        equipment_images = $4,
        personal_document_note = $5,
        document_note = $6
      WHERE id = $7
      RETURNING id
      `,
            [handover_date, status, customer_document_image, equipment_images, personal_document_note, document_note, id]
        );

        if (handoverResult.rowCount === 0) {
            return res.status(404).json({ error: 'Handover not found' });
        }

        // Delete existing equipment items
        await pool.query('DELETE FROM handover_equipment_items WHERE handover_id = $1', [id]);

        // Insert updated equipment items
        for (const item of equipment_items) {
            await pool.query(
                `
        INSERT INTO handover_equipment_items 
          (handover_id, equipment_id, quantity, condition)
        VALUES ($1, $2, $3, $4)
        `,
                [id, item.equipment_id, item.quantity, item.condition]
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');

        res.json({
            success: true,
            message: 'Handover updated successfully',
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await pool.query('ROLLBACK');
        console.error('Error updating handover:', error);
        res.status(500).json({ error: 'Failed to update handover' });
    }
};

// Delete a handover
exports.deleteHandover = async (req, res) => {
    const { id } = req.params;

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Delete equipment items first
        await pool.query('DELETE FROM handover_equipment_items WHERE handover_id = $1', [id]);

        // Delete the handover
        const result = await pool.query('DELETE FROM handovers WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Handover not found' });
        }

        // Commit the transaction
        await pool.query('COMMIT');

        res.json({ success: true, message: 'Handover deleted successfully' });
    } catch (error) {
        // Rollback the transaction in case of error
        await pool.query('ROLLBACK');
        console.error('Error deleting handover:', error);
        res.status(500).json({ error: 'Failed to delete handover' });
    }
};