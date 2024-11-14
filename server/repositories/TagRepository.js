const Tags = require('../models/Tags');
const Dares = require('../models/Dares');

class TagRepository {
  async findById(id) {
    return await Tags.findById(id);
  }

  async getTagsByDareId(dareId) {
    const dare = await Dares.findById(dareId).populate({
      path: 'tags',
      select: 'tagName id',
    });
    return dare ? dare.tags : [];
  }
}

module.exports = new TagRepository();
