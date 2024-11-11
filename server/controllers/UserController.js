const UserService = require('../services/UserService');
const { validateToken } = require('../middlewares/AuthMiddleware');

class UserController {
  // Registro de un nuevo usuario
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;
      
      // Verificar si el nombre de usuario ya está registrado
      const existingUser = await UserService.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }

      // Si no existe, registrar el nuevo usuario
      await UserService.registerUser(username, password);
      res.json('Usuario agregado');
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      res.status(500).json({ error: error.message });
    }
  }

  // Login de usuario
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const tokenData = await UserService.loginUser(username, password);
      res.json(tokenData);
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      res.status(400).json({ error: error.message });
    }
  }

  // Verificar el token de sesión
  async checkToken(req, res) {
    try {
      res.json(req.user);
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      res.status(500).json({ error: 'Error al verificar el token' });
    }
  }

  // Obtener usuario por ID
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      res.status(404).json({ error: error.message });
    }
  }

  // Otros métodos si son necesarios
}

module.exports = new UserController();
