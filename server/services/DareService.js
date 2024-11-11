// services/DareService.js
const DareRepository = require('../repositories/DareRepository');
const redisClient = require('../config/redis');

class DareService {
  async getRandomDares(limit) {
    const cacheKey = `random_dares_${limit}`;
    try {
      const cachedDares = await redisClient.get(cacheKey);
      if (cachedDares) {
        return JSON.parse(cachedDares);
      } else {
        const dares = await DareRepository.findRandom(limit);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(dares)); // Expira en 5 minutos
        return dares;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const dares = await DareRepository.findRandom(limit);
      return dares;
    }
  }

  async getDareById(id) {
    const cacheKey = `dare_${id}`;
    try {
      const cachedDare = await redisClient.get(cacheKey);
      if (cachedDare) {
        return JSON.parse(cachedDare);
      } else {
        const dare = await DareRepository.findById(id);
        if (!dare) {
          throw new Error('Dare no encontrado');
        }
        await redisClient.setEx(cacheKey, 300, JSON.stringify(dare));
        return dare;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      throw error;
    }
  }
}

module.exports = new DareService();
