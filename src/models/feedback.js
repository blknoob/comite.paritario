const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('No establecido el URI de MongoDB en las variables de entorno');
    }

    await mongoose.connect(MONGO_URI); // ✅ ya no se necesitan las opciones
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
