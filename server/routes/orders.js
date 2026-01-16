const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create Order
router.post('/', async (req, res) => {
    const { items, totalAmount } = req.body; // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }

    try {
        const order = await prisma.order.create({
            data: {
                totalAmount,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            },
            include: { items: true }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// List Orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
