const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models'); // Database connection
const app = express();
const PORT = 5000;

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());

// Import routes
const postRoutes = require('./routes/PostRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const dareRoutes = require('./routes/DareRoutes');
const userRoutes = require('./routes/UserRoutes');
const ratingRoutes = require('./routes/RatingRoutes');
const tagRoutes = require('./routes/TagRoutes');

// Use routes
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/dares', dareRoutes);
app.use('/auth', userRoutes);
app.use('/ratings', ratingRoutes);
app.use('/tags', tagRoutes);

// Start the server and handle open connections
db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  let connections = [];

  // Track connections to close them manually
  server.on('connection', (connection) => {
    connections.push(connection);
    connection.on('close', () => {
      connections = connections.filter((curr) => curr !== connection);
    });
  });

  // Handle server shutdown gracefully
  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('HTTP server closed.');
      db.sequelize.close() // Close database connection
        .then(() => {
          console.log('Database connection closed.');
          process.exit(0);
        })
        .catch((err) => {
          console.error('Error closing database connection:', err);
          process.exit(1);
        });
    });

    // End open connections
    connections.forEach((conn) => conn.end());
    setTimeout(() => connections.forEach((conn) => conn.destroy()), 5000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});
