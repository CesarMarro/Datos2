// config/redis.js
const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://127.0.0.1:6379', // Ajusta la URL si Redis está en otro host o puerto
});

redisClient.on('error', (err) => {
  console.error('Error al conectar con Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado a Redis exitosamente');
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error al conectar con Redis:', err);
  }
})();

module.exports = redisClient;
