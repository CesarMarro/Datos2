const Ratings = require('../models/Ratings');

class RatingRepository {
  async findByUserAndPost(userId, postId) {
    return await Ratings.findOne({ UserId: userId, PostId: postId });
  }

  async findByPostId(postId) {
    return await Ratings.find({ PostId: postId });
  }

  async findByUserId(userId) {
    return await Ratings.find({ UserId: userId });
  }

  async create(ratingData) {
    return await Ratings.create(ratingData);
  }

  async update(userId, postId, ratingValue) {
    return await Ratings.findOneAndUpdate(
      { UserId: userId, PostId: postId },
      { ratingValue },
      { new: true }
    );
  }
}

module.exports = new RatingRepository();
