const Users = require('../models/Users');

class UserRepository {
  async findById(id) {
    return await Users.findById(id).select('-password');
  }

  async findByUsername(username) {
    return await Users.findOne({ username });
  }

  async create(userData) {
    return await Users.create(userData);
  }

  async updateTotalPoints(userId, totalPoints) {
    return await Users.findByIdAndUpdate(userId, { totalPoints }, { new: true });
  }
}

module.exports = new UserRepository();
