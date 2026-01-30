const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || null;

const issueToken = (user) => {
    const secret = getJwtSecret();
    if (!secret) {
        return null;
    }
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        secret,
        { expiresIn: '12h' }
    );
};

// Bootstrap first admin account (only when no admin exists)
router.post('/bootstrap', async (req, res) => {
    const { username, password, setupKey } = req.body;
    const requiredKey = process.env.ADMIN_SETUP_KEY;

    if (!requiredKey || setupKey !== requiredKey) {
        return res.status(403).json({ error: 'Invalid setup key' });
    }
    if (!username || !password || password.length < 8) {
        return res.status(400).json({ error: 'Username and password (min 8 chars) required' });
    }

    const existingCount = await prisma.adminUser.count();
    if (existingCount > 0) {
        return res.status(403).json({ error: 'Bootstrap disabled after first admin' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.create({
        data: { username, passwordHash }
    });

    const token = issueToken(user);
    if (!token) {
        return res.status(500).json({ error: 'JWT_SECRET is not configured' });
    }

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken(user);
    if (!token) {
        return res.status(500).json({ error: 'JWT_SECRET is not configured' });
    }

    await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
    });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Current user
router.get('/me', requireAuth, async (req, res) => {
    const user = await prisma.adminUser.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, role: true, lastLoginAt: true, createdAt: true }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

module.exports = router;
