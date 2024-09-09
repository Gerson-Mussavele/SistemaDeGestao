// controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Função para criar um token JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, 'seu-segredo-jwt', { expiresIn: '3d' });
};

// Controlador de signup
const signup = async (req, res) => {
  const { email, password, category } = req.body;

  try {
    const user = await User.signup(email, password, category);
    const token = createToken(user._id);
    
    res.status(201).json({ email: user.email, category: user.category, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador de login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, category: user.category, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login };
