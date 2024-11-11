const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

class UserService {
  // Obtener un usuario por su ID
  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  // Obtener un usuario por su nombre de usuario (para evitar duplicados)
  async getUserByUsername(username) {
    const user = await UserRepository.findByUsername(username);
    return user; // Retorna el usuario si existe, o null si no existe
  }

  // Registrar un nuevo usuario
  async registerUser(username, password) {
    // Verificar si el nombre de usuario ya existe
    const existingUser = await this.getUserByUsername(username);
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear el usuario con la contraseña encriptada
    return await UserRepository.create({ username, password: hashedPassword });
  }

  // Iniciar sesión y obtener un token
  async loginUser(username, password) {
    // Buscar al usuario por nombre de usuario
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new Error('Ese usuario no existe');
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Combinación incorrecta de usuario y contraseña');
    }

    // Generar un token JWT
    const accessToken = sign({ username: user.username, id: user.id }, 'importantsecret');
    return { token: accessToken, username: username, id: user.id };
  }

  // Otros métodos si son necesarios
}

module.exports = new UserService();
