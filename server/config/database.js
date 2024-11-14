const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://root:password@localhost:27017/socialDareDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin', // Si usas autenticación
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

