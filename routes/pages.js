const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// Create Page
router.post('/create', async (req, res) => {
  try {
    const { userId, name, date, rate } = req.body;

    if (!userId || !name || !date || rate === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pageId = uuidv4();

    await db.run(
      'INSERT INTO pages (id, user_id, name, date, rate) VALUES (?, ?, ?, ?, ?)',
      [pageId, userId, name, date, rate]
    );

    res.status(201).json({ 
      success: true, 
      pageId,
      message: 'Page created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Pages for User
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pages = await db.all(
      'SELECT * FROM pages WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Page with Data
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const page = await db.get('SELECT * FROM pages WHERE id = ?', [pageId]);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const rows = await db.all(
      'SELECT * FROM data_rows WHERE page_id = ? ORDER BY serial_number ASC',
      [pageId]
    );

    res.json({ success: true, page, rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close Page
router.put('/:pageId/close', async (req, res) => {
  try {
    const { pageId } = req.params;

    await db.run(
      'UPDATE pages SET is_closed = 1 WHERE id = ?',
      [pageId]
    );

    res.json({ success: true, message: 'Page closed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reopen Page (requires PIN verification)
router.put('/:pageId/reopen', async (req, res) => {
  try {
    const { pageId } = req.params;

    await db.run(
      'UPDATE pages SET is_closed = 0 WHERE id = ?',
      [pageId]
    );

    res.json({ success: true, message: 'Page reopened successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Page Dashboard (Summary)
router.get('/:pageId/dashboard', async (req, res) => {
  try {
    const { pageId } = req.params;
    const rows = await db.all(
      'SELECT * FROM data_rows WHERE page_id = ?',
      [pageId]
    );

    const totalDirham = rows.reduce((sum, row) => sum + (row.dirham || 0), 0);
    const totalBDT = rows.reduce((sum, row) => sum + (row.bdt || 0), 0);
    const verifiedCount = rows.filter(row => row.is_verified === 1).length;
    const totalRows = rows.length;

    res.json({ 
      success: true, 
      dashboard: {
        totalRows,
        verifiedCount,
        pendingCount: totalRows - verifiedCount,
        totalDirham: totalDirham.toFixed(2),
        totalBDT: totalBDT.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
