// services/TagService.js
const TagRepository = require('../repositories/TagRepository');

class TagService {
  async getTagById(id) {
    const tag = await TagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag no encontrado');
    }
    return tag;
  }

  // Otros métodos si son necesarios
}

module.exports = new TagService();
