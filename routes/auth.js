const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('../database');

// Register (Create new user with PIN)
router.post('/register', async (req, res) => {
  try {
    const { name, pin } = req.body;

    if (!name || !pin) {
      return res.status(400).json({ error: 'Name and PIN required' });
    }

    if (pin.length !== 4 || isNaN(pin)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    const userId = uuidv4();
    const hashedPin = await bcrypt.hash(pin, 10);

    await db.run(
      'INSERT INTO users (id, name, pin) VALUES (?, ?, ?)',
      [userId, name, hashedPin]
    );

    res.status(201).json({ 
      success: true, 
      userId, 
      name,
      message: 'User registered successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login (Verify PIN)
router.post('/login', async (req, res) => {
  try {
    const { name, pin } = req.body;

    if (!name || !pin) {
      return res.status(400).json({ error: 'Name and PIN required' });
    }

    const user = await db.get('SELECT * FROM users WHERE name = ?', [name]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid name or PIN' });
    }

    const isValidPin = await bcrypt.compare(pin, user.pin);

    if (!isValidPin) {
      return res.status(401).json({ error: 'Invalid name or PIN' });
    }

    res.json({ 
      success: true, 
      userId: user.id, 
      name: user.name,
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
