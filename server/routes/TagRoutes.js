// routes/TagRoutes.js
const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

// Obtener un tag por ID
router.get('/:id', (req, res) => TagController.getTagById(req, res));

module.exports = router;
