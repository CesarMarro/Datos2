// controllers/PostController.js
const PostService = require('../services/PostService');

class PostController {
  async getAllPosts(req, res) {
  
      const posts = await PostService.getAllPosts();
      res.json(posts);
    
  }

  async getPostById(req, res) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.json(post);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getPostsByDareId(req, res) {
    try {
      const posts = await PostService.getPostsByDareId(req.params.id);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPostsByTagId(req, res) {
    try {
      const posts = await PostService.getPostsByTagId(req.params.id);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPostsByUserId(req, res) {
    try {
      const posts = await PostService.getPostsByUserId(req.params.id);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPost(req, res) {
    try {
      const userId = req.user.id;
      const postData = req.body;
      const file = req.file;

      const newPost = await PostService.createPost(postData, file, userId);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePost(req, res) {
    try {
      await PostService.deletePost(req.params.id);
      res.json({ message: 'Post eliminado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Otros métodos si son necesarios
}

module.exports = new PostController();
