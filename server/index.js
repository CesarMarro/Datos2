const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models'); // Conexión a la base de datos
const redisClient = require('./config/redis'); // Importa el cliente de Redis
const app = express();
const PORT = 5000;

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());

// Importar rutas
const postRoutes = require('./routes/PostRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const dareRoutes = require('./routes/DareRoutes');
const userRoutes = require('./routes/UserRoutes');
const ratingRoutes = require('./routes/RatingRoutes');
const tagRoutes = require('./routes/TagRoutes');

// Usar rutas
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/dares', dareRoutes);
app.use('/auth', userRoutes);
app.use('/ratings', ratingRoutes);
app.use('/tags', tagRoutes);

// Iniciar el servidor y manejar conexiones abiertas
db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  let connections = [];

  // Seguir las conexiones para cerrarlas manualmente
  server.on('connection', (connection) => {
    connections.push(connection);
    connection.on('close', () => {
      connections = connections.filter((curr) => curr !== connection);
    });
  });

  // Manejar el apagado del servidor de forma segura
  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('HTTP server closed.');
      db.sequelize.close() // Cerrar conexión a la base de datos
        .then(() => {
          console.log('Database connection closed.');
          process.exit(0);
        })
        .catch((err) => {
          console.error('Error closing database connection:', err);
          process.exit(1);
        });
    });

    // Terminar conexiones abiertas
    connections.forEach((conn) => conn.end());
    setTimeout(() => connections.forEach((conn) => conn.destroy()), 5000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});
