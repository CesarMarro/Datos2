// routes/RatingRoutes.js
const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/RatingController');
const { validateToken } = require('../middlewares/AuthMiddleware');

// Agregar o actualizar una calificación
router.post('/', validateToken, (req, res) => RatingController.addOrUpdateRating(req, res));

// Obtener todas las calificaciones del usuario autenticado
router.get('/', validateToken, (req, res) => RatingController.getUserRatings(req, res));

// Obtener la calificación del usuario para un post específico
router.get('/:postId', validateToken, (req, res) =>
  RatingController.getUserRatingForPost(req, res)
);

module.exports = router;
