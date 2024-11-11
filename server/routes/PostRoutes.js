// routes/PostRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/PostController');
const { validateToken } = require('../middlewares/AuthMiddleware');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Asegúrate de que la carpeta 'uploads' exista
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Rutas
router.get('/', (req, res) => PostController.getAllPosts(req, res));
router.get('/byId/:id', (req, res) => PostController.getPostById(req, res));
router.get('/byDare/:id', (req, res) => PostController.getPostsByDareId(req, res));
router.get('/byTag/:id', (req, res) => PostController.getPostsByTagId(req, res));
router.get('/byUserId/:id', (req, res) => PostController.getPostsByUserId(req, res));

router.post('/', validateToken, upload.single('photo'), (req, res) =>
  PostController.createPost(req, res)
);

router.delete('/:id', validateToken, (req, res) => PostController.deletePost(req, res));

module.exports = router;
