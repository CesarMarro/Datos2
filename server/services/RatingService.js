// services/RatingService.js
const RatingRepository = require('../repositories/RatingRepository');
const PostRepository = require('../repositories/PostRepository');
const UserRepository = require('../repositories/UserRepository');
const { sequelize } = require('../models');

class RatingService {
  async addOrUpdateRating(userId, postId, ratingValue) {
    const t = await sequelize.transaction();
    try {
      const existingRating = await RatingRepository.findByUserAndPost(userId, postId);

      if (!existingRating) {
        await RatingRepository.create({ UserId: userId, PostId: postId, ratingValue }, { transaction: t });
      } else {
        await RatingRepository.update(userId, postId, ratingValue, { transaction: t });
      }

      await this.updateAverageRating(postId, t);

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateAverageRating(postId, transaction) {
    const ratings = await RatingRepository.findByPostId(postId);
    const post = await PostRepository.findById(postId);
    const user = await UserRepository.findById(post.UserId);

    if (ratings.length > 0) {
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
      const averageRating = totalRatings / ratings.length;

      await PostRepository.update(postId, { averageRating }, { transaction });

      // Lógica para otorgar o restar puntos
      if (averageRating > 2.5 && !post.pointsAwarded) {
        const newTotalPoints = user.totalPoints + post.Dare.points;
        await UserRepository.updateTotalPoints(user.id, newTotalPoints, { transaction });
        await PostRepository.update(postId, { pointsAwarded: true }, { transaction });
      } else if (averageRating <= 2.5 && post.pointsAwarded) {
        const newTotalPoints = Math.max(user.totalPoints - post.Dare.points, 0);
        await UserRepository.updateTotalPoints(user.id, newTotalPoints, { transaction });
        await PostRepository.update(postId, { pointsAwarded: false }, { transaction });
      }
    } else {
      await PostRepository.update(postId, { averageRating: 0 }, { transaction });
      if (post.pointsAwarded) {
        const newTotalPoints = Math.max(user.totalPoints - post.Dare.points, 0);
        await UserRepository.updateTotalPoints(user.id, newTotalPoints, { transaction });
        await PostRepository.update(postId, { pointsAwarded: false }, { transaction });
      }
    }
  }

  async getUserRatings(userId) {
    return await RatingRepository.findByUserId(userId);
  }

  async getUserRatingForPost(userId, postId) {
    return await RatingRepository.findByUserAndPost(userId, postId);
  }

  // Otros métodos si son necesarios
}

module.exports = new RatingService();
