// repositories/CommentRepository.js
const { Comments, Users } = require('../models');

class CommentRepository {
  async findByPostId(postId) {
    return await Comments.findAll({
      where: { PostId: postId },
      include: {
        model: Users,
        attributes: ['username'],
        required: false,
      },
    });
  }

  async create(commentData) {
    return await Comments.create(commentData);
  }

  async delete(commentId) {
    return await Comments.destroy({
      where: { id: commentId },
    });
  }

  // Otros métodos si son necesarios
}

module.exports = new CommentRepository();
