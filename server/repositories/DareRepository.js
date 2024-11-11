// repositories/DareRepository.js
const { Dares, Tags, sequelize } = require('../models');

class DareRepository {
  async findRandom(limit = 4) {
    const count = await Dares.count();
    return await Dares.findAll({
      order: [sequelize.random()],
      limit: Math.min(limit, count),
    });
  }

  async findById(id) {
    return await Dares.findByPk(id, {
      include: {
        model: Tags,
        through: { attributes: [] },
        attributes: ['tagName', 'id'],
      },
    });
  }

  // Otros métodos si son necesarios
}

module.exports = new DareRepository();
