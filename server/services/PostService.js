// services/PostService.js
const PostRepository = require('../repositories/PostRepository');
const redisClient = require('../config/redis');
const Tags = require('../models/Tags');


class PostService {
  async getAllPosts() {
    const cacheKey = 'all_posts';
    try {
      const cachedPosts = await redisClient.get(cacheKey);
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      } else {
        const posts = await PostRepository.findAll();
        await redisClient.setEx(cacheKey, 300, JSON.stringify(posts)); // Expira en 5 minutos
        return posts;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const posts = await PostRepository.findAll();
      return posts;
    }
  }

  async getPostById(id) {
    const cacheKey = `post_${id}`;
    try {
      const cachedPost = await redisClient.get(cacheKey);
      if (cachedPost) {
        return JSON.parse(cachedPost);
      } else {
        const post = await PostRepository.findById(id);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(post));
        return post;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const post = await PostRepository.findById(id);
      return post;
    }
  }

  async getPostsByDareId(dareId) {
    const cacheKey = `posts_dare_${dareId}`;
    try {
      const cachedPosts = await redisClient.get(cacheKey);
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      } else {
        const posts = await PostRepository.findByDareId(dareId);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
        return posts;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const posts = await PostRepository.findByDareId(dareId);
      return posts;
    }
  }

  async getPostsByTagId(tagId) {
    const cacheKey = `posts_tag_${tagId}`;
    try {
      const cachedPosts = await redisClient.get(cacheKey);
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      } else {
        const posts = await PostRepository.findByTagId(tagId);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
        return posts;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const posts = await PostRepository.findByTagId(tagId);
      return posts;
    }
  }

  async getPostsByUserId(userId) {
    const cacheKey = `posts_user_${userId}`;
    try {
      const cachedPosts = await redisClient.get(cacheKey);
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      } else {
        const posts = await PostRepository.findByUserId(userId);
        await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
        return posts;
      }
    } catch (error) {
      console.error('Error al acceder al caché de Redis:', error);
      const posts = await PostRepository.findByUserId(userId);
      return posts;
    }
  }

  async createPost(postData, file, userId) {
    // Asigna photoUrl correctamente
    let photoUrl = null;
    if (file) {
      photoUrl = '/uploads/' + file.filename;
    }
  
    const newPostData = {
      postText: postData.postText,
      DareId: postData.DareId,
      UserId: userId,
      photoUrl: photoUrl,
    };
  
    const newPost = await PostRepository.create(newPostData);
  
    // Invalida el caché relevante
    await redisClient.del('all_posts');
    await redisClient.del(`posts_user_${userId}`);
    await redisClient.del(`posts_dare_${postData.DareId}`);
  
    if (postData.tagIds && postData.tagIds.length > 0) {
      for (const tagId of postData.tagIds) {
        await redisClient.del(`posts_tag_${tagId}`);
      }
    }
  
    return newPost;
  }

  async deletePost(postId) {
    const post = await PostRepository.findById(postId);
    if (!post) {
      throw new Error('Post no encontrado');
    }

    await PostRepository.delete(postId);

    // Invalida el caché relevante
    await redisClient.del('all_posts');
    await redisClient.del(`post_${postId}`);
    await redisClient.del(`posts_user_${post.UserId}`);
    await redisClient.del(`posts_dare_${post.DareId}`);

    if (post.Tags && post.Tags.length > 0) {
      for (const tag of post.Tags) {
        await redisClient.del(`posts_tag_${tag.id}`);
      }
    }
  }
}

module.exports = new PostService();
