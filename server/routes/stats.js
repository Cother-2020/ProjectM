const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Get Dashboard Statistics
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Get all orders for calculations
        const allOrders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Today's orders
        const todayOrders = allOrders.filter(order =>
            new Date(order.createdAt) >= startOfToday
        );

        // Calculate statistics
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const avgOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

        // Order status distribution
        const statusDistribution = {
            PENDING: allOrders.filter(o => o.status === 'PENDING').length,
            PREPARING: allOrders.filter(o => o.status === 'PREPARING').length,
            READY: allOrders.filter(o => o.status === 'READY').length,
            COMPLETED: allOrders.filter(o => o.status === 'COMPLETED').length
        };

        // Pending orders count
        const pendingOrders = statusDistribution.PENDING + statusDistribution.PREPARING;

        // Top selling dishes
        const productSales = {};
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    const productId = item.product.id;
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            id: productId,
                            name: item.product.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productSales[productId].quantity += item.quantity;
                    productSales[productId].revenue += item.quantity * item.product.price;
                }
            });
        });

        const topDishes = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Recent orders (last 5)
        const recentOrders = allOrders.slice(0, 5).map(order => ({
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
            createdAt: order.createdAt
        }));

        res.json({
            todayOrders: todayOrders.length,
            todayRevenue,
            totalRevenue,
            totalOrders: allOrders.length,
            avgOrderValue,
            pendingOrders,
            statusDistribution,
            topDishes,
            recentOrders
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
