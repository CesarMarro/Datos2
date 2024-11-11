// services/PostService.js
const PostRepository = require('../repositories/PostRepository');
const TagRepository = require('../repositories/TagRepository');
const { sequelize } = require('../models');

class PostService {
  async getAllPosts() {
    return await PostRepository.findAll();
  }

  async getPostById(id) {
    const post = await PostRepository.findById(id);
    if (!post) {
      throw new Error('Post no encontrado');
    }
    return post;
  }

  async getPostsByDareId(dareId) {
    return await PostRepository.findByDareId(dareId);
  }

  async getPostsByTagId(tagId) {
    return await PostRepository.findByTagId(tagId);
  }

  async getPostsByUserId(userId) {
    return await PostRepository.findByUserId(userId);
  }

  async createPost(postData, file, userId) {
    const t = await sequelize.transaction();  // Start the transaction
    try {
      // Step 1: Create the post (this is the main operation that needs to be inside the transaction)
      const newPost = await PostRepository.create(
        {
          ...postData,
          photoUrl: file ? `/uploads/${file.filename}` : null,
          UserId: userId,
        },
        { transaction: t }  // Pass the transaction to the create operation
      );
  
      // Step 2: Fetch associated tags for the dare (this can be done outside of the transaction)
      const dareTags = await TagRepository.getTagsByDareId(postData.DareId);
  
      // Step 3: If tags exist, associate them with the post (this needs to be inside the transaction)
      if (dareTags && dareTags.length > 0) {
        await newPost.addTags(dareTags, { transaction: t });  // Associating tags inside the transaction
      }
  
      // Step 4: Commit the transaction (this commits both the post creation and tag association)
      await t.commit();
      return newPost;
    } catch (error) {
      // Step 5: If anything goes wrong, rollback the transaction
      await t.rollback();
      throw error;  // Rethrow the error to be handled by the controller
    }
  }
  

  async deletePost(postId) {
    const deletedRows = await PostRepository.delete(postId);
    if (deletedRows === 0) {
      throw new Error('Post no encontrado o no se pudo eliminar');
    }
    return deletedRows;
  }

  // Otros métodos si son necesarios
}

module.exports = new PostService();
