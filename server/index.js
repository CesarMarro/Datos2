// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database'); // Conexión a la base de datos
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

// Conectar a la base de datos
connectDB();

// Usar rutas
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/dares', dareRoutes);
app.use('/auth', userRoutes);
app.use('/ratings', ratingRoutes);
app.use('/tags', tagRoutes);

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejar cierre del servidor y conexiones abiertas
let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on('close', () => {
    connections = connections.filter((curr) => curr !== connection);
  });
});

const shutdown = () => {
  console.log('Apagando el servidor...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });

  // Terminar conexiones abiertas
  connections.forEach((conn) => conn.end());
  setTimeout(() => connections.forEach((conn) => conn.destroy()), 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

