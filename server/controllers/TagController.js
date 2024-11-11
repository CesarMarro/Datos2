// controllers/TagController.js
const TagService = require('../services/TagService');

class TagController {
  async getTagById(req, res) {
    
      const tag = await TagService.getTagById(req.params.id);
      res.json(tag);
    
  }

  // Otros métodos si son necesarios
}

module.exports = new TagController();
