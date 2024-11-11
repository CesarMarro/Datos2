// routes/DareRoutes.js
const express = require('express');
const router = express.Router();
const DareController = require('../controllers/DareController');

// Obtener dares aleatorios
router.get('/random', (req, res) => DareController.getRandomDares(req, res));

// Obtener un dare por ID
router.get('/:id', (req, res) => DareController.getDareById(req, res));

module.exports = router;
