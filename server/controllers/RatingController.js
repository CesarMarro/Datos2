// controllers/RatingController.js
const RatingService = require('../services/RatingService');

class RatingController {
  async addOrUpdateRating(req, res) {
    try {
      const userId = req.user.id;
      const { PostId, ratingValue } = req.body;
      await RatingService.addOrUpdateRating(userId, PostId, ratingValue);
      res.json('Success');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserRatings(req, res) {
    try {
      const userId = req.user.id;
      const ratings = await RatingService.getUserRatings(userId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserRatingForPost(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;
      const rating = await RatingService.getUserRatingForPost(userId, postId);
      res.json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Otros métodos si son necesarios
}

module.exports = new RatingController();
