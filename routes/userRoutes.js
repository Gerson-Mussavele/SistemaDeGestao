const express = require('express');
const { signup, login } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota de Signup
router.post('/signup', signup);

// Rota de Login
router.post('/login', login);

// Rota protegida de exemplo (somente Admins)
router.get('/admin-only', requireAuth, requireAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' });
});

module.exports = router;
