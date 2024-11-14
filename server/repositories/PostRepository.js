const Posts = require('../models/Posts');
const Dares = require('../models/Dares');
const Users = require('../models/Users');
const Tags = require('../models/Tags');

class PostRepository {
  async findAll() {
    return await Posts.find().populate([
      {
        path: 'DareId',
        select: 'dare points id',
      },
      {
        path: 'UserId',
        select: 'username id',
      },
    ]);
  }

  async findById(id) {
    return await Posts.findById(id).populate([
      {
        path: 'DareId',
        select: 'dare points id description',
      },
      {
        path: 'UserId',
        select: 'username',
      },
    ]);
  }

  async findByDareId(dareId) {
    return await Posts.find({ DareId: dareId }).populate([
      {
        path: 'DareId',
        select: 'dare points id',
      },
      {
        path: 'UserId',
        select: 'username id',
      },
    ]);
  }

  async findByTagId(tagId) {
    return await Posts.find({ tags: tagId }).populate([
      {
        path: 'tags',
        match: { _id: tagId },
        select: 'tagName',
      },
      {
        path: 'UserId',
        select: 'username id',
      },
      {
        path: 'DareId',
        select: 'dare points id',
      },
    ]);
  }

  async findByUserId(userId) {
    return await Posts.find({ UserId: userId }).populate([
      {
        path: 'DareId',
        select: 'dare points id',
      },
      {
        path: 'UserId',
        select: 'username',
      },
    ]);
  }

  async create(postData) {
    return await Posts.create(postData);
  }

  async update(postId, updateData) {
    return await Posts.findByIdAndUpdate(postId, updateData, { new: true });
  }

  async delete(postId) {
    return await Posts.findByIdAndDelete(postId);
  }
}

module.exports = new PostRepository();
