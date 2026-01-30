const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return null;
    }
    return secret;
};

const requireAuth = (req, res, next) => {
    const secret = getJwtSecret();
    if (!secret) {
        return res.status(500).json({ error: 'JWT_SECRET is not configured' });
    }

    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        return next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const requireRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
};

module.exports = { requireAuth, requireRole };
