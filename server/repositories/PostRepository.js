// repositories/PostRepository.js
const { Posts, Dares, Users, Tags } = require('../models');

class PostRepository {
  async findAll() {
    return await Posts.findAll({
      include: [
        {
          model: Dares,
          attributes: ['dare', 'points', 'id'],
          required: true,
        },
        {
          model: Users,
          attributes: ['username', 'id'],
          required: true,
        },
      ],
    });
  }

  async findById(id) {
    return await Posts.findByPk(id, {
      include: [
        {
          model: Dares,
          attributes: ['dare', 'points', 'id', 'description'],
          required: false,
        },
        {
          model: Users,
          attributes: ['username'],
          required: true,
        },
      ],
    });
  }

  async findByDareId(dareId) {
    return await Posts.findAll({
      where: { DareId: dareId },
      include: [
        {
          model: Dares,
          attributes: ['dare', 'points', 'id'],
          required: false,
        },
        {
          model: Users,
          attributes: ['username', 'id'],
          required: true,
        },
      ],
    });
  }

  async findByTagId(tagId) {
    return await Posts.findAll({
      include: [
        {
          model: Tags,
          where: { id: tagId },
          through: { attributes: [] },
        },
        {
          model: Users,
          attributes: ['username', 'id'],
          required: true,
        },
        {
          model: Dares,
          attributes: ['dare', 'points', 'id'],
          required: false,
        },
      ],
    });
  }

  async findByUserId(userId) {
    return await Posts.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Dares,
          attributes: ['dare', 'points', 'id'],
          required: false,
        },
        {
          model: Users,
          attributes: ['username'],
          required: true,
        },
      ],
    });
  }

  async create(postData) {
    return await Posts.create(postData);
  }

  async update(postId, updateData) {
    return await Posts.update(updateData, { where: { id: postId } });
  }

  async delete(postId) {
    return await Posts.destroy({
      where: { id: postId },
    });
  }

  // Otros métodos si son necesarios
}

module.exports = new PostRepository();
