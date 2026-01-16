const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ include: { products: true } });
        res.json(categories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add Category (Admin)
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const category = await prisma.category.create({
            data: { name }
        });
        res.json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete Category (Admin)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { force } = req.query; // Check for force flag

    try {
        const categoryId = parseInt(id);

        if (force === 'true') {
            // Delete all products in this category first
            await prisma.product.deleteMany({
                where: { categoryId }
            });
        } else {
            // Default safe mode: Check if category has products
            const productsCount = await prisma.product.count({
                where: { categoryId }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    error: 'Category contains products.',
                    requiresForce: true,
                    count: productsCount
                });
            }
        }

        await prisma.category.delete({ where: { id: categoryId } });
        res.json({ message: 'Category deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
