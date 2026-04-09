const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM categories');

        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// ADD CATEGORY
router.post('/', (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ error: 'Category name required' });
    }

    const query = `
        INSERT INTO categories (category_name)
        VALUES (?)
    `;

    db.query(query, [category_name], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Category added' });
    });
});
module.exports = router;
