const { Dares, Tags } = require('../models');  // Importamos correctamente Dares y Tag

class TagRepository {
  async findById(id) {
    return await Tags.findByPk(id);
  }

  async getTagsByDareId(dareId) {
    const dare = await Dares.findByPk(dareId, {
      include: [
        {
          model: Tags,
          through: { attributes: [] },
        },
      ],
    });
    return dare ? dare.Tags : [];
  }

  // Otros métodos si son necesarios
}

module.exports = new TagRepository();
