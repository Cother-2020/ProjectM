const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { requireAuth } = require('../middleware/auth');

const ALLOWED_STATUSES = new Set(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELED"]);

// Create Order
router.post('/', async (req, res) => {
    const { items, totalAmount, notes } = req.body; // items: [{ productId, quantity, selectedOptions: [{ name, price }] }]

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }

    try {
        const order = await prisma.order.create({
            data: {
                totalAmount,
                notes: notes || null,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        selectedOptions: {
                            create: item.selectedOptions?.map(opt => ({
                                name: opt.name,
                                price: parseFloat(opt.price)
                            })) || []
                        }
                    }))
                },
                statusHistory: {
                    create: {
                        fromStatus: null,
                        toStatus: "PENDING",
                        note: "Order created"
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true,
                        selectedOptions: true
                    }
                }
            }
        });

        // Emit real-time event
        const io = req.app.get('io');
        io.emit('order:new', order);

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get Order by ID (Customer tracking)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: {
                    include: {
                        product: true,
                        selectedOptions: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Orders (Public)
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                        selectedOptions: true
                    }
                }
            },
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
    const { status, note } = req.body;

    if (!status || !ALLOWED_STATUSES.has(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const order = await prisma.$transaction(async (tx) => {
            const existing = await tx.order.findUnique({ where: { id: parseInt(id) } });
            if (!existing) return null;

            const updated = await tx.order.update({
                where: { id: parseInt(id) },
                data: { status },
                include: {
                    items: {
                        include: {
                            product: true,
                            selectedOptions: true
                        }
                    }
                }
            });

            await tx.orderStatusHistory.create({
                data: {
                    orderId: updated.id,
                    fromStatus: existing.status,
                    toStatus: status,
                    note: note || null
                }
            });

            return updated;
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Emit real-time event
        const io = req.app.get('io');
        io.emit('order:update', order);

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel Order (Exception handling)
router.patch('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const { reason, note } = req.body;

    if (!reason || typeof reason !== 'string') {
        return res.status(400).json({ error: 'Cancel reason is required' });
    }

    try {
        const order = await prisma.$transaction(async (tx) => {
            const existing = await tx.order.findUnique({ where: { id: parseInt(id) } });
            if (!existing) return null;

            const updated = await tx.order.update({
                where: { id: parseInt(id) },
                data: {
                    status: "CANCELED",
                    cancelReason: reason,
                    canceledAt: new Date()
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            selectedOptions: true
                        }
                    }
                }
            });

            await tx.orderStatusHistory.create({
                data: {
                    orderId: updated.id,
                    fromStatus: existing.status,
                    toStatus: "CANCELED",
                    reason,
                    note: note || null
                }
            });

            return updated;
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const io = req.app.get('io');
        io.emit('order:update', order);

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order status history
router.get('/:id/history', async (req, res) => {
    const { id } = req.params;

    try {
        const history = await prisma.orderStatusHistory.findMany({
            where: { orderId: parseInt(id) },
            orderBy: { createdAt: 'asc' }
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
