const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para verificar o token JWT
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.user = _id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

// Middleware para verificar a categoria do usuário (admin ou cashier)
const requireAdmin = async (req, res, next) => {
    const user = await User.findById(req.user);

    if (user.category !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    next();
};

module.exports = { requireAuth, requireAdmin };
