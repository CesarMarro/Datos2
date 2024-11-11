// services/TagService.js
const TagRepository = require('../repositories/TagRepository');
const redisClient = require('../config/redis');

class TagService {
  async getTagById(id) {
    const cacheKey = `tag_${id}`;
    try {
      const cachedTag = await redisClient.get(cacheKey);
      if (cachedTag) {
        return JSON.parse(cachedTag);
      } else {
        const tag = await TagRepository.findById(id);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(tag));
        return tag;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const tag = await TagRepository.findById(id);
      return tag;
    }
  }
}

module.exports = new TagService();
