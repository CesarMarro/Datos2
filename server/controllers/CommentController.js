// controllers/CommentController.js
const CommentService = require('../services/CommentService');

class CommentController {
  async getCommentsByPostId(req, res) {
    try {
      const comments = await CommentService.getCommentsByPostId(req.params.postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createComment(req, res) {
    try {
      const commentData = req.body;
      commentData.UserId = req.user.id;
      const newComment = await CommentService.createComment(commentData);
      res.json(newComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      await CommentService.deleteComment(req.params.commentId);
      res.json('Comentario borrado');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Otros métodos si son necesarios
}

module.exports = new CommentController();
