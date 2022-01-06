require('dotenv').config()// Lo primero que tenemos que hacer en nuestra aplicación es ejecutar dotenv.config() para que busque las variables de .env y las asigne correctamente.
require('./mongo')// Se conecta a la base de datos, si no lo guardas en una variable CommonJS lo que hace es ejecutar el contenido
const express = require('express')
const logger = require('./middlewares/loggerMiddleware')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const blogsRouter = require('./controllers/blogs')

const app = express()
const PORT = process.env.PORT

app.use(express.json())// body-parser necesario para realizar POST
app.use(logger)
app.use(cors())// Cors previene un error que surge cuando se intenta acceder a recursos desde un puerto distinto al de los recursos. Puedes limitar los orígenes que pueden acceder.

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.use('/blogs', blogsRouter)

app.use('/users', usersRouter)

app.use(notFound)

app.use(handleErrors)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`))
}

module.exports = { app }
