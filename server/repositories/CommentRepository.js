const Comments = require('../models/Comments');
const Users = require('../models/Users');

class CommentRepository {
  async findByPostId(postId) {
    return await Comments.find({ PostId: postId }).populate({
      path: 'UserId',
      select: 'username',
    });
  }

  async create(commentData) {
    return await Comments.create(commentData);
  }

  async delete(commentId) {
    return await Comments.findByIdAndDelete(commentId);
  }
}

module.exports = new CommentRepository();
