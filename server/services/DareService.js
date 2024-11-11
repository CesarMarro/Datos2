// services/DareService.js
const DareRepository = require('../repositories/DareRepository');

class DareService {
  async getRandomDares(limit) {
    return await DareRepository.findRandom(limit);
  }

  async getDareById(id) {
    const dare = await DareRepository.findById(id);
    if (!dare) {
      throw new Error('Dare no encontrado');
    }
    return dare;
  }

  // Otros métodos si son necesarios
}

module.exports = new DareService();
