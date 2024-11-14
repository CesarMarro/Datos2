const Dares = require('../models/Dares');
const Tags = require('../models/Tags');

class DareRepository {
  async findRandom(limit = 4) {
    const count = await Dares.countDocuments();
    const randomLimit = Math.min(limit, count);
    return await Dares.aggregate([{ $sample: { size: randomLimit } }]);
  }

  async findById(id) {
    return await Dares.findById(id).populate({
      path: 'tags',
      select: 'tagName id',
    });
  }
}

module.exports = new DareRepository();
