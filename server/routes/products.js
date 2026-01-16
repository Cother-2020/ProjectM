const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
    const { categoryId } = req.query;
    try {
        const where = {};
        if (categoryId) {
            const parsedId = parseInt(categoryId);
            if (!isNaN(parsedId)) {
                where.categoryId = parsedId;
            }
        }
        const products = await prisma.product.findMany({ where });
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add Product (Admin)
router.post('/', async (req, res) => {
    const { name, description, price, imageUrl, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: 'Name, price, and categoryId are required' });
    }

    const priceFloat = parseFloat(price);
    const categoryIdInt = parseInt(categoryId);

    if (isNaN(priceFloat) || isNaN(categoryIdInt)) {
        return res.status(400).json({ error: 'Invalid price or category ID' });
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description: description || '',
                price: priceFloat,
                imageUrl: imageUrl || 'https://placehold.co/400x300?text=Food',
                availableTime: req.body.availableTime || 'ALL',
                categoryId: categoryIdInt
            }
        });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Product (Admin)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, categoryId } = req.body;

    const priceFloat = parseFloat(price);
    const categoryIdInt = parseInt(categoryId);

    if (isNaN(priceFloat) || isNaN(categoryIdInt)) {
        return res.status(400).json({ error: 'Invalid price or category ID' });
    }

    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: priceFloat,
                imageUrl,
                availableTime: req.body.availableTime,
                categoryId: categoryIdInt
            }
        });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete Product (Admin)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Product deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
