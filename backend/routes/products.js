const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products or filter by category/search
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = `
            SELECT p.*, c.category_name, m.manufacturer_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
        `;

        let conditions = [];
        let params = [];

        if (category) {
            conditions.push('c.category_name = ?');
            params.push(category);
        }

        if (search) {
            conditions.push('p.product_name LIKE ?');
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [results] = await db.query(query, params);

        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT p.*, c.category_name, m.manufacturer_name, m.country 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id 
            WHERE p.product_id = ?
        `;

        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// UPDATE STOCK
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;

        const query = `
            UPDATE products 
            SET stock_quantity = ? 
            WHERE product_id = ?
        `;

        await db.query(query, [stock_quantity, id]);

        res.json({ message: 'Stock updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
module.exports = router;