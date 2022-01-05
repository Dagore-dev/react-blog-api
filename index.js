require('dotenv').config()// Lo primero que tenemos que hacer en nuestra aplicación es ejecutar dotenv.config() para que busque las variables de .env y las asigne correctamente.
require('./mongo')// Se conecta a la base de datos, si no lo guardas en una variable CommonJS lo que hace es ejecutar el contenido
const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const Blog = require('./models/Blog')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

const app = express()
const PORT = process.env.PORT

app.use(express.json())// body-parser necesario para realizar POST
app.use(logger)
app.use(cors())// Cors previene un error que surge cuando se intenta acceder a recursos desde un puerto distinto al de los recursos. Puedes limitar los orígenes que pueden acceder.

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

app.get('/blogs/:id', (request, response, next) => {
  const { id } = request.params

  Blog.findById(id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

app.delete('/blogs/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

app.post('/blogs', async (request, response, next) => {
  const blog = request.body

  if (blog.title && blog.body && blog.author) {
    const newBlog = new Blog({
      title: blog.title,
      body: blog.body,
      author: blog.author
    })

    try {
      const savedBlog = await newBlog.save()
      response.json(savedBlog)
    } catch (err) {
      next(err)
    }
  } else {
    response.status(400).json({
      error: 'Something is missing'
    })
  }
})

app.put('/blogs/:id', (request, response, next) => {
  const { id } = request.params
  const blog = request.body

  const newBlogContent = {
    title: blog.title,
    body: blog.body,
    author: blog.author
  }

  Blog.findByIdAndUpdate(id, newBlogContent, { new: true })
    .then(blog => {
      response.json(blog)
    })
    .catch(err => {
      next(err)
    })
})

app.use(notFound)

app.use(handleErrors)

const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`))

module.exports = { app, server }
