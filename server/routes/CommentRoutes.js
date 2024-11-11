// routes/CommentRoutes.js
const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { validateToken } = require('../middlewares/AuthMiddleware');

// Obtener comentarios de un post
router.get('/:postId', (req, res) => CommentController.getCommentsByPostId(req, res));

// Crear un comentario
router.post('/', validateToken, (req, res) => CommentController.createComment(req, res));

// Eliminar un comentario
router.delete('/delete/:commentId', validateToken, (req, res) =>
  CommentController.deleteComment(req, res)
);

module.exports = router;
