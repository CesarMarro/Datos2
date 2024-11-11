// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateToken } = require('../middlewares/AuthMiddleware');

// Registrar usuario
router.post('/', (req, res) => UserController.registerUser(req, res));

// Login de usuario
router.post('/login', (req, res) => UserController.loginUser(req, res));

// Verificar token
router.get('/check', validateToken, (req, res) => UserController.checkToken(req, res));

// Obtener información básica del usuario
router.get('/basicinfo/:id', (req, res) => UserController.getUserById(req, res));

module.exports = router;
