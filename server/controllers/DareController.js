// controllers/DareController.js
const DareService = require('../services/DareService');

class DareController {
  async getRandomDares(req, res) {
   
      const dares = await DareService.getRandomDares();
      res.json(dares);

  }

  async getDareById(req, res) {
  
      const dare = await DareService.getDareById(req.params.id);
      res.json(dare);
 
  }

  // Otros métodos si son necesarios
}

module.exports = new DareController();
