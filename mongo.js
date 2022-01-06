const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env// Se extraen las variables de entorno necesarias.
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI// Una base de datos para los test y otra para producción/desarrollo. SOLUCIÓN NO DEFINITIVA

// Conexión a mongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch(err => {
    console.error(err)
  })
