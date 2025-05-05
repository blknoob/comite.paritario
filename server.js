const express = require('express');
const app = require('./src/app.js');
const dotenv = require('dotenv');
const connectDB = require('./src/models/feedback.js'); // Cambia la ruta según tu estructura de carpetas

dotenv.config();

connectDB()
  .then(() => {
    console.log('Conexión a MongoDB exitosa en server.js');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
  });

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
} );