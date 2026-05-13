const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// Add Data Row
router.post('/add', async (req, res) => {
  try {
    const { pageId, remark, bdNumber, dirham, bdt, uaeNumber } = req.body;

    if (!pageId) {
      return res.status(400).json({ error: 'Page ID required' });
    }

    // Get serial number
    const lastRow = await db.get(
      'SELECT MAX(serial_number) as maxSerial FROM data_rows WHERE page_id = ?',
      [pageId]
    );
    const serialNumber = (lastRow?.maxSerial || 0) + 1;

    const rowId = uuidv4();
    const uaeTime = new Date().toISOString();

    await db.run(
      `INSERT INTO data_rows 
       (id, page_id, serial_number, remark, bd_number, dirham, bdt, uae_number, entry_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [rowId, pageId, serialNumber, remark, bdNumber, dirham, bdt, uaeNumber, uaeTime]
    );

    res.status(201).json({ 
      success: true, 
      rowId,
      serialNumber,
      entryTime: uaeTime,
      message: 'Data added successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Data Row
router.put('/:rowId', async (req, res) => {
  try {
    const { rowId } = req.params;
    const { remark, bdNumber, dirham, bdt, uaeNumber } = req.body;

    await db.run(
      `UPDATE data_rows 
       SET remark = ?, bd_number = ?, dirham = ?, bdt = ?, uae_number = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [remark, bdNumber, dirham, bdt, uaeNumber, rowId]
    );

    res.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify (Tick) Data Row
router.put('/:rowId/verify', async (req, res) => {
  try {
    const { rowId } = req.params;
    const verificationId = uuidv4();
    const verifiedTime = new Date().toISOString();

    await db.run(
      'UPDATE data_rows SET is_verified = 1, color = "green", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [rowId]
    );

    await db.run(
      'INSERT INTO verification_history (id, data_row_id, verified_at) VALUES (?, ?, ?)',
      [verificationId, rowId, verifiedTime]
    );

    res.json({ success: true, message: 'Data verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Row Color
router.put('/:rowId/color', async (req, res) => {
  try {
    const { rowId } = req.params;
    const { color } = req.body;

    if (!['red', 'green', 'pink', 'normal'].includes(color)) {
      return res.status(400).json({ error: 'Invalid color' });
    }

    // If color is red, unverify the row
    if (color === 'red') {
      await db.run(
        'UPDATE data_rows SET is_verified = 0 WHERE id = ?',
        [rowId]
      );
    }

    await db.run(
      'UPDATE data_rows SET color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [color, rowId]
    );

    res.json({ success: true, message: 'Color updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Data Row
router.delete('/:rowId', async (req, res) => {
  try {
    const { rowId } = req.params;

    await db.run('DELETE FROM verification_history WHERE data_row_id = ?', [rowId]);
    await db.run('DELETE FROM data_rows WHERE id = ?', [rowId]);

    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Data
router.get('/search/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const searchTerm = `%${query}%`;
    const results = await db.all(
      `SELECT * FROM data_rows 
       WHERE page_id = ? AND (remark LIKE ? OR bd_number LIKE ? OR uae_number LIKE ?)
       ORDER BY serial_number ASC`,
      [pageId, searchTerm, searchTerm, searchTerm]
    );

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
