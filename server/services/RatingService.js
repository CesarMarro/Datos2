const RatingRepository = require('../repositories/RatingRepository');
const PostRepository = require('../repositories/PostRepository');
const UserRepository = require('../repositories/UserRepository');

class RatingService {
  async addOrUpdateRating(userId, postId, ratingValue) {
    // Comprueba si ya existe una calificación de este usuario para este post
    const existingRating = await RatingRepository.findByUserAndPost(userId, postId);

    if (existingRating) {
      // Si existe, actualiza la calificación
      await RatingRepository.update(userId, postId, ratingValue);
    } else {
      // Si no existe, crea una nueva calificación
      await RatingRepository.create({ UserId: userId, PostId: postId, ratingValue });
    }

    // Actualizar el promedio de calificación del post
    await this.updateAverageRating(postId);
  }

  async updateAverageRating(postId) {
    const ratings = await RatingRepository.findByPostId(postId);
    const post = await PostRepository.findById(postId);
    
    if (!post) {
      throw new Error(`Post con ID ${postId} no encontrado`);
    }
  
    const user = await UserRepository.findById(post.UserId);
  
    if (ratings.length > 0) {
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
      const averageRating = totalRatings / ratings.length;
  
      await PostRepository.update(postId, { averageRating });
  
      // Corrección aquí
      if (post.DareId && post.DareId.points) {
        // Lógica para otorgar o restar puntos
        if (averageRating > 2.5 && !post.pointsAwarded) {
          const newTotalPoints = user.totalPoints + post.DareId.points;
          await UserRepository.updateTotalPoints(user.id, newTotalPoints);
          await PostRepository.update(postId, { pointsAwarded: true });
        } else if (averageRating <= 2.5 && post.pointsAwarded) {
          const newTotalPoints = Math.max(user.totalPoints - post.DareId.points, 0);
          await UserRepository.updateTotalPoints(user.id, newTotalPoints);
          await PostRepository.update(postId, { pointsAwarded: false });
        }
      }
    } else {
      await PostRepository.update(postId, { averageRating: 0 });
  
      if (post.pointsAwarded && post.DareId && post.DareId.points) {
        const newTotalPoints = Math.max(user.totalPoints - post.DareId.points, 0);
        await UserRepository.updateTotalPoints(user.id, newTotalPoints);
        await PostRepository.update(postId, { pointsAwarded: false });
      }
    }
  }
  
  

  async getUserRatings(userId) {
    return await RatingRepository.findByUserId(userId);
  }

  async getUserRatingForPost(userId, postId) {
    return await RatingRepository.findByUserAndPost(userId, postId);
  }
}

module.exports = new RatingService();
