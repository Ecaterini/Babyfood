const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders');

        res.json(orders);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;