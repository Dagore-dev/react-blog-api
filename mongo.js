const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

// Conexión a mongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch(err => {
    console.error(err)
  })
