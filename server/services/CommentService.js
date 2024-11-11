// services/CommentService.js
const CommentRepository = require('../repositories/CommentRepository');

class CommentService {
  async getCommentsByPostId(postId) {
    return await CommentRepository.findByPostId(postId);
  }

  async createComment(commentData) {
    return await CommentRepository.create(commentData);
  }

  async deleteComment(commentId) {
    const deletedRows = await CommentRepository.delete(commentId);
    if (deletedRows === 0) {
      throw new Error('Comentario no encontrado o no se pudo eliminar');
    }
    return deletedRows;
  }

  // Otros métodos si son necesarios
}

module.exports = new CommentService();
