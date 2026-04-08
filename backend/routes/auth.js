const express = require('express');
const router = express.Router();
const db = require('../db');

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

        const [results] = await db.query(query, [email, password]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user: results[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        await db.query(query, [name, email, password]);

        res.json({ message: 'User created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;