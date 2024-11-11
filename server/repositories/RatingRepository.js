// repositories/RatingRepository.js
const { Ratings } = require('../models');

class RatingRepository {
  async findByUserAndPost(userId, postId) {
    return await Ratings.findOne({
      where: { UserId: userId, PostId: postId },
    });
  }

  async findByPostId(postId) {
    return await Ratings.findAll({
      where: { PostId: postId },
    });
  }

  async findByUserId(userId) {
    return await Ratings.findAll({
      where: { UserId: userId },
    });
  }

  async create(ratingData) {
    return await Ratings.create(ratingData);
  }

  async update(userId, postId, ratingValue) {
    return await Ratings.update(
      { ratingValue },
      { where: { UserId: userId, PostId: postId } }
    );
  }

  // Otros métodos si son necesarios
}

module.exports = new RatingRepository();
