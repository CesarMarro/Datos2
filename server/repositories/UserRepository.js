// repositories/UserRepository.js
const { Users } = require('../models');

class UserRepository {
  async findById(id) {
    return await Users.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async findByUsername(username) {
    return await Users.findOne({ where: { username } });
  }

  async create(userData) {
    return await Users.create(userData);
  }

  async updateTotalPoints(userId, totalPoints) {
    return await Users.update(
      { totalPoints },
      { where: { id: userId } }
    );
  }

  static async findByUsername(username) {
    return await Users.findOne({ where: { username } });
  }

  // Puedes agregar otros métodos si es necesario
}

module.exports = new UserRepository();
